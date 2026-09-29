/**
 * The neural lattices behind the page, drawn on <canvas>. Two engines:
 *
 * - `mountSphere`: the hero. Nodes drift inside a globe larger than the section, links form
 *   by 3D proximity, close nodes push apart and crowded ones get a random nudge, a click adds
 *   a node, and a drag spins the globe with velocity-based inertia.
 * - `mountDrift`: the quiet lattice behind the profile stack and the carousel. Nodes drift in
 *   2D and link when near; the pointer pulls gently on them.
 *
 * Colours come from CSS variables (--net-rgb, --net-line-a, ...) so both themes work; call
 * the returned handle's `recolor()` when the theme changes. Each mount returns a cleanup.
 */
import { clamp, finePointer, onThemeChange, reduceMotion } from "@/lib/theme";

type Colors = { rgb: string; hub: string; la: number; na: number; sa: number };

type ColorOverrides = Partial<Pick<Colors, "rgb" | "hub" | "la" | "na" | "sa">>;

function readColors(o: ColorOverrides): Colors {
  const cs = getComputedStyle(document.documentElement);
  const num = (name: string, fallback: number) => {
    const v = parseFloat(cs.getPropertyValue(name));
    return Number.isNaN(v) ? fallback : v;
  };
  const rgb = o.rgb ?? (cs.getPropertyValue("--net-rgb").trim() || "240,125,34");
  return {
    rgb,
    hub: o.hub ?? (cs.getPropertyValue("--net-hub-rgb").trim() || rgb),
    la: o.la ?? num("--net-line-a", 0.16),
    na: o.na ?? num("--net-node-a", 0.55),
    sa: o.sa ?? num("--net-spot-a", 0.4),
  };
}

function sizeCanvas(host: HTMLElement, c: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  const r = host.getBoundingClientRect();
  const dpr = Math.min(1.5, window.devicePixelRatio || 1);
  const W = Math.max(2, Math.round(r.width));
  const H = Math.max(2, Math.round(r.height));
  c.width = Math.round(W * dpr);
  c.height = Math.round(H * dpr);
  c.style.width = `${W}px`;
  c.style.height = `${H}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { W, H };
}

/* ------------------------------------------------------------------ the hero sphere */

export type SphereOptions = ColorOverrides & {
  /** Node count before clicks add more. */
  max?: number;
  /** Radius as a fraction of the larger side of the host. Above 0.5 the globe spills past the edges. */
  r?: number;
  /** Where the globe's centre sits, as a fraction of the host's height. */
  cy?: number;
  perspective?: number;
  linkDist?: number;
  minDist?: number;
  spin?: number;
  drift?: number;
  /** Radians of rotation per pixel dragged. */
  gain?: number;
  friction?: number;
  vmax?: number;
};

type SphereNode = {
  p: [number, number, number];
  v: [number, number, number];
  r: number;
  hub: boolean;
  born: number;
  sx: number;
  sy: number;
  sc: number;
  d: number;
  nb: number;
};

export function mountSphere(host: HTMLElement, zone: HTMLElement, o: SphereOptions = {}): () => void {
  const c = host.querySelector("canvas") ?? host.appendChild(document.createElement("canvas"));
  const ctx = c.getContext("2d");
  if (!ctx) return () => {};

  const F = o.perspective ?? 2.8;
  const L = o.linkDist ?? 0.34;
  const DMIN = o.minDist ?? 0.17;
  const N = o.max ?? 130;
  const SPIN = o.spin ?? 0.00005;
  const DRIFT = o.drift ?? 0.000035;
  const G = o.gain ?? 0.0022;
  const FR = o.friction ?? 0.978;
  const VMAX = o.vmax ?? 0.0035;

  let W = 0;
  let H = 0;
  let cx = 0;
  let cy = 0;
  let Rpx = 100;
  let nodes: SphereNode[] = [];
  let spawned: SphereNode[] = [];
  let col = readColors(o);
  let visible = true;
  let raf = 0;
  let last = 0;
  let T = 0;
  let rotX = 0.22;
  let rotY = 0;
  let velX = 0;
  let velY = 0;
  let dragging = false;
  let moved = false;
  let lx = 0;
  let ly = 0;
  let lt = 0;
  let dx0 = 0;
  let dy0 = 0;
  let pid: number | null = null;
  let px = -1e4;
  let py = -1e4;
  let tpx = -1e4;
  let tpy = -1e4;
  let reduce = reduceMotion();

  const rnd = () => Math.random() * 2 - 1;

  function makeNode(x: number, y: number, z: number, hub: boolean): SphereNode {
    const v: [number, number, number] = [rnd(), rnd(), rnd()];
    const m = Math.hypot(v[0], v[1], v[2]) || 1;
    const s = DRIFT * (0.5 + Math.random());
    return { p: [x, y, z], v: [(v[0] / m) * s, (v[1] / m) * s, (v[2] / m) * s], r: 1.3 + Math.random() * 1.2, hub, born: 0, sx: 0, sy: 0, sc: 1, d: 0, nb: 0 };
  }

  function seed() {
    nodes = [];
    spawned = [];
    for (let i = 0; i < N; i++) {
      const u = [rnd(), rnd(), rnd()];
      const m = Math.hypot(u[0], u[1], u[2]) || 1;
      const r = 0.5 + 0.5 * Math.cbrt(Math.random());
      nodes.push(makeNode((u[0] / m) * r, (u[1] / m) * r, (u[2] / m) * r, Math.random() < 0.11));
    }
  }

  function resize() {
    ({ W, H } = sizeCanvas(host, c, ctx!));
    cx = W / 2;
    cy = H * (o.cy ?? 0.5);
    Rpx = Math.max(W, H) * (o.r ?? 0.62);
    if (!nodes.length) seed();
  }

  function project() {
    const cY = Math.cos(rotY);
    const sY = Math.sin(rotY);
    const cX = Math.cos(rotX);
    const sX = Math.sin(rotX);
    for (const n of nodes) {
      const [x, y, z] = n.p;
      const x1 = x * cY + z * sY;
      const z1 = -x * sY + z * cY;
      const y2 = y * cX - z1 * sX;
      const z2 = y * sX + z1 * cX;
      const sc = F / (F - z2);
      n.sx = cx + x1 * Rpx * sc;
      n.sy = cy + y2 * Rpx * sc;
      n.sc = sc;
      n.d = (z2 + 1) / 2;
    }
  }

  /** Screen point to a point on the front of the globe, undoing the current rotation. */
  function unproject(sx: number, sy: number): [number, number, number] {
    const cY = Math.cos(rotY);
    const sY = Math.sin(rotY);
    const cX = Math.cos(rotX);
    const sX = Math.sin(rotX);
    let nx = (sx - cx) / Rpx;
    let ny = (sy - cy) / Rpx;
    let nz = 0;
    for (let k = 0; k < 3; k++) {
      let rr = nx * nx + ny * ny;
      if (rr > 0.96) {
        const f = Math.sqrt(0.96 / rr);
        nx *= f;
        ny *= f;
        rr = 0.96;
      }
      nz = Math.sqrt(1 - rr);
      const sc = F / (F - nz);
      nx = (sx - cx) / (Rpx * sc);
      ny = (sy - cy) / (Rpx * sc);
    }
    const y1 = ny * cX + nz * sX;
    const z1 = -ny * sX + nz * cX;
    return [nx * cY - z1 * sY, y1, nx * sY + z1 * cY];
  }

  function step(dt: number) {
    T += dt;
    if (!dragging) {
      if (Math.abs(velY) > 1e-6 || Math.abs(velX) > 1e-6) {
        rotY += velY * dt;
        rotX += velX * dt;
        const f = Math.pow(FR, dt / 16);
        velY *= f;
        velX *= f;
        if (Math.abs(velY) < 1e-6) velY = 0;
        if (Math.abs(velX) < 1e-6) velX = 0;
      }
      if (!reduce) rotY += SPIN * dt;
    }
    rotX = clamp(rotX, -1.25, 1.25);
    const n = nodes.length;
    for (let i = 0; i < n; i++) {
      const a = nodes[i];
      const p = a.p;
      const v = a.v;
      p[0] += v[0] * dt;
      p[1] += v[1] * dt;
      p[2] += v[2] * dt;
      const m = Math.hypot(p[0], p[1], p[2]);
      if (m > 1) {
        const nx = p[0] / m;
        const ny = p[1] / m;
        const nz = p[2] / m;
        const dot = v[0] * nx + v[1] * ny + v[2] * nz;
        v[0] -= 2 * dot * nx;
        v[1] -= 2 * dot * ny;
        v[2] -= 2 * dot * nz;
        p[0] = nx;
        p[1] = ny;
        p[2] = nz;
      } else if (m < 0.42 && m > 0) {
        v[0] += (p[0] / m) * 0.000002 * dt;
        v[1] += (p[1] / m) * 0.000002 * dt;
        v[2] += (p[2] / m) * 0.000002 * dt;
      }
      a.nb = 0;
    }
    // Clumps spread: close pairs push apart, and a crowded node gets a random nudge.
    for (let i = 0; i < n; i++) {
      const A = nodes[i];
      for (let j = i + 1; j < n; j++) {
        const B = nodes[j];
        const ddx = A.p[0] - B.p[0];
        const ddy = A.p[1] - B.p[1];
        const ddz = A.p[2] - B.p[2];
        const d = Math.hypot(ddx, ddy, ddz);
        if (d < L) {
          A.nb++;
          B.nb++;
        }
        if (d < DMIN && d > 1e-4) {
          const k = (((DMIN - d) / DMIN) * 0.00000045 * dt) / d;
          A.v[0] += ddx * k;
          A.v[1] += ddy * k;
          A.v[2] += ddz * k;
          B.v[0] -= ddx * k;
          B.v[1] -= ddy * k;
          B.v[2] -= ddz * k;
        }
      }
    }
    const cap = DRIFT * 2.4;
    for (const q of nodes) {
      if (q.nb > 6 && Math.random() < 0.012) {
        const u = [rnd(), rnd(), rnd()];
        const um = Math.hypot(u[0], u[1], u[2]) || 1;
        q.v[0] += (u[0] / um) * DRIFT * 1.6;
        q.v[1] += (u[1] / um) * DRIFT * 1.6;
        q.v[2] += (u[2] / um) * DRIFT * 1.6;
      }
      const sp = Math.hypot(q.v[0], q.v[1], q.v[2]);
      if (sp > cap) {
        q.v[0] *= cap / sp;
        q.v[1] *= cap / sp;
        q.v[2] *= cap / sp;
      }
    }
    px += (tpx - px) * 0.1;
    py += (tpy - py) * 0.1;
    project();
  }

  function draw() {
    ctx!.clearRect(0, 0, W, H);
    const { rgb } = col;
    const n = nodes.length;
    ctx!.lineWidth = 1;
    for (let i = 0; i < n; i++) {
      const A = nodes[i];
      for (let j = i + 1; j < n; j++) {
        const B = nodes[j];
        const d = Math.hypot(A.p[0] - B.p[0], A.p[1] - B.p[1], A.p[2] - B.p[2]);
        if (d >= L) continue;
        const dep = (A.d + B.d) / 2;
        let al = col.la * (1 - d / L) * (0.3 + 0.7 * dep);
        if (px > -1e3) {
          const dp = Math.hypot((A.sx + B.sx) / 2 - px, (A.sy + B.sy) / 2 - py);
          if (dp < 180) al += (1 - dp / 180) * col.sa * (0.4 + 0.6 * dep);
        }
        ctx!.strokeStyle = `rgba(${rgb},${Math.min(1, al).toFixed(3)})`;
        ctx!.beginPath();
        ctx!.moveTo(A.sx, A.sy);
        ctx!.lineTo(B.sx, B.sy);
        ctx!.stroke();
      }
    }
    for (const q of nodes) {
      let rr = q.r * q.sc;
      let al = (q.hub ? col.na + 0.25 : col.na) * (0.3 + 0.7 * q.d);
      const rc = q.hub ? col.hub : rgb;
      if (q.hub) {
        const g = ctx!.createRadialGradient(q.sx, q.sy, 0, q.sx, q.sy, 10 * q.sc);
        g.addColorStop(0, `rgba(${rc},${(0.3 * q.d + 0.06).toFixed(3)})`);
        g.addColorStop(1, `rgba(${rc},0)`);
        ctx!.fillStyle = g;
        ctx!.beginPath();
        ctx!.arc(q.sx, q.sy, 10 * q.sc, 0, 6.2832);
        ctx!.fill();
        rr += 1;
      }
      if (q.born && T - q.born < 700) {
        const t = (T - q.born) / 700;
        ctx!.strokeStyle = `rgba(${rc},${((1 - t) * 0.6).toFixed(3)})`;
        ctx!.lineWidth = 1.2;
        ctx!.beginPath();
        ctx!.arc(q.sx, q.sy, 4 + t * 26 * q.sc, 0, 6.2832);
        ctx!.stroke();
        ctx!.lineWidth = 1;
        al = Math.min(1, al + (1 - t) * 0.5);
      }
      ctx!.fillStyle = `rgba(${rc},${Math.min(1, al).toFixed(3)})`;
      ctx!.beginPath();
      ctx!.arc(q.sx, q.sy, rr, 0, 6.2832);
      ctx!.fill();
    }
  }

  function spawn(sx: number, sy: number) {
    const p = unproject(sx, sy);
    const nn = makeNode(p[0], p[1], p[2], false);
    nn.born = T || 1;
    nn.r = 1.8;
    nodes.push(nn);
    spawned.push(nn);
    if (nodes.length > N + 40) {
      const old = spawned.shift();
      const ix = old ? nodes.indexOf(old) : -1;
      if (ix > -1) nodes.splice(ix, 1);
    }
  }

  function frame(now: number) {
    raf = 0;
    const dt = last ? Math.min(48, now - last) : 16;
    last = now;
    step(dt);
    draw();
    if (visible && !document.hidden) raf = requestAnimationFrame(frame);
    else last = 0;
  }
  function start() {
    if (!raf) {
      last = 0;
      raf = requestAnimationFrame(frame);
    }
  }
  function still() {
    step(16);
    draw();
  }

  resize();
  if (reduce) still();
  else start();

  const ro = new ResizeObserver(() => {
    resize();
    if (reduce) still();
  });
  ro.observe(host);
  const io = new IntersectionObserver(
    (es) => {
      visible = es[0].isIntersecting;
      if (visible) start();
    },
    { rootMargin: "80px" }
  );
  io.observe(host);
  const onVis = () => {
    if (!document.hidden) start();
  };
  document.addEventListener("visibilitychange", onVis);
  const offTheme = onThemeChange(() => {
    col = readColors(o);
    if (reduce) still();
  });
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  const onMq = () => {
    reduce = mq.matches;
    if (!reduce) start();
  };
  mq.addEventListener("change", onMq);

  const onMove = (e: PointerEvent) => {
    const r = host.getBoundingClientRect();
    tpx = e.clientX - r.left;
    tpy = e.clientY - r.top;
    if (!dragging || e.pointerId !== pid) return;
    const now = performance.now();
    const dt = Math.max(1, now - lt);
    const dx = e.clientX - lx;
    const dy = e.clientY - ly;
    rotY += dx * G;
    rotX = clamp(rotX + dy * G, -1.25, 1.25);
    velY = clamp(velY * 0.6 + ((dx * G) / dt) * 0.4, -VMAX, VMAX);
    velX = clamp(velX * 0.6 + ((dy * G) / dt) * 0.4, -VMAX, VMAX);
    lx = e.clientX;
    ly = e.clientY;
    lt = now;
    if (Math.hypot(e.clientX - dx0, e.clientY - dy0) > 5) moved = true;
    if (moved) e.preventDefault();
    start();
  };
  const onLeave = () => {
    tpx = -1e4;
    tpy = -1e4;
  };
  const onDown = (e: PointerEvent) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    const t = e.target as Element;
    if (t.closest("a,button,input,label,select,textarea,.stack,[data-no-spin]")) return;
    dragging = true;
    moved = false;
    pid = e.pointerId;
    lx = dx0 = e.clientX;
    ly = dy0 = e.clientY;
    lt = performance.now();
    velX = velY = 0;
    zone.classList.add("is-spinning");
    try {
      zone.setPointerCapture(pid);
    } catch {
      // Some browsers refuse capture during synthetic events; the drag still works.
    }
    start();
  };
  const release = (e: PointerEvent) => {
    if (!dragging || e.pointerId !== pid) return;
    dragging = false;
    zone.classList.remove("is-spinning");
    if (performance.now() - lt > 90) {
      velX = 0;
      velY = 0;
    }
    if (!moved) {
      const r = host.getBoundingClientRect();
      spawn(e.clientX - r.left, e.clientY - r.top);
    }
    start();
  };
  zone.addEventListener("pointermove", onMove, { passive: false });
  zone.addEventListener("pointerleave", onLeave);
  zone.addEventListener("pointerdown", onDown);
  zone.addEventListener("pointerup", release);
  zone.addEventListener("pointercancel", release);

  return () => {
    cancelAnimationFrame(raf);
    raf = 0;
    ro.disconnect();
    io.disconnect();
    document.removeEventListener("visibilitychange", onVis);
    offTheme();
    mq.removeEventListener("change", onMq);
    zone.removeEventListener("pointermove", onMove);
    zone.removeEventListener("pointerleave", onLeave);
    zone.removeEventListener("pointerdown", onDown);
    zone.removeEventListener("pointerup", release);
    zone.removeEventListener("pointercancel", release);
  };
}

/* ------------------------------------------------------------------ the drifting lattice */

export type DriftOptions = ColorOverrides & {
  /** Square pixels per node. */
  density?: number;
  max?: number;
  min?: number;
  /** Pixels per millisecond. */
  speed?: number;
  linkDist?: number;
};

type DriftNode = { x: number; y: number; vx: number; vy: number; r: number; hub: boolean };

export function mountDrift(host: HTMLElement, o: DriftOptions = {}): () => void {
  const c = host.querySelector("canvas") ?? host.appendChild(document.createElement("canvas"));
  const ctx = c.getContext("2d");
  if (!ctx) return () => {};
  const zone = host.parentElement ?? host;
  const R = o.linkDist ?? 160;
  const SPEED = o.speed ?? 0.02;
  let W = 0;
  let H = 0;
  let nodes: DriftNode[] = [];
  let col = readColors(o);
  let visible = true;
  let raf = 0;
  let last = 0;
  let px = -1e4;
  let py = -1e4;
  let tpx = -1e4;
  let tpy = -1e4;
  let reduce = reduceMotion();

  function seed() {
    nodes = [];
    const n = Math.round(Math.min(o.max ?? 110, Math.max(o.min ?? 16, (W * H) / (o.density ?? 15000))));
    for (let i = 0; i < n; i++) {
      const ang = Math.random() * 6.28;
      const spd = SPEED * (0.5 + Math.random());
      nodes.push({ x: Math.random() * W, y: Math.random() * H, vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd, r: 1.3 + Math.random() * 1.2, hub: Math.random() < 0.1 });
    }
  }
  function resize() {
    const w = W;
    const h = H;
    ({ W, H } = sizeCanvas(host, c, ctx!));
    if (!nodes.length || Math.abs(W - w) > 40 || Math.abs(H - h) > 40) seed();
  }
  function step(dt: number) {
    const mx = SPEED * 2.2;
    for (const q of nodes) {
      q.x += q.vx * dt;
      q.y += q.vy * dt;
      if (q.x < -20) q.x = W + 20;
      if (q.x > W + 20) q.x = -20;
      if (q.y < -20) q.y = H + 20;
      if (q.y > H + 20) q.y = -20;
      if (px > -1e3) {
        const dx = px - q.x;
        const dy = py - q.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 220 * 220 && d2 > 1) {
          const f = 0.000018 * dt;
          q.vx += dx * f;
          q.vy += dy * f;
        }
        const v = Math.hypot(q.vx, q.vy);
        if (v > mx) {
          q.vx *= mx / v;
          q.vy *= mx / v;
        }
      }
    }
    px += (tpx - px) * 0.08;
    py += (tpy - py) * 0.08;
  }
  function draw() {
    ctx!.clearRect(0, 0, W, H);
    const { rgb } = col;
    const R2 = R * R;
    ctx!.lineWidth = 1;
    for (let i = 0; i < nodes.length; i++) {
      const A = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const B = nodes[j];
        const dx = A.x - B.x;
        const dy = A.y - B.y;
        const d2 = dx * dx + dy * dy;
        if (d2 >= R2) continue;
        const al = col.la * (1 - Math.sqrt(d2) / R);
        ctx!.strokeStyle = `rgba(${rgb},${al.toFixed(3)})`;
        ctx!.beginPath();
        ctx!.moveTo(A.x, A.y);
        ctx!.lineTo(B.x, B.y);
        ctx!.stroke();
      }
      if (px > -1e3) {
        const ed = Math.hypot(A.x - px, A.y - py);
        if (ed < 200) {
          ctx!.strokeStyle = `rgba(${rgb},${(col.la * 1.6 * (1 - ed / 200)).toFixed(3)})`;
          ctx!.beginPath();
          ctx!.moveTo(A.x, A.y);
          ctx!.lineTo(px, py);
          ctx!.stroke();
        }
      }
    }
    for (const q of nodes) {
      const rc = q.hub ? col.hub : rgb;
      if (q.hub) {
        const g = ctx!.createRadialGradient(q.x, q.y, 0, q.x, q.y, 10);
        g.addColorStop(0, `rgba(${rc},.28)`);
        g.addColorStop(1, `rgba(${rc},0)`);
        ctx!.fillStyle = g;
        ctx!.beginPath();
        ctx!.arc(q.x, q.y, 10, 0, 6.2832);
        ctx!.fill();
      }
      ctx!.fillStyle = `rgba(${rc},${Math.min(1, q.hub ? col.na + 0.25 : col.na).toFixed(2)})`;
      ctx!.beginPath();
      ctx!.arc(q.x, q.y, q.r + (q.hub ? 1 : 0), 0, 6.2832);
      ctx!.fill();
    }
  }
  function frame(now: number) {
    raf = 0;
    const dt = last ? Math.min(48, now - last) : 16;
    last = now;
    step(dt);
    draw();
    if (visible && !reduce && !document.hidden) raf = requestAnimationFrame(frame);
    else last = 0;
  }
  function start() {
    if (!raf && !reduce) {
      last = 0;
      raf = requestAnimationFrame(frame);
    }
  }
  function still() {
    step(16);
    draw();
  }

  resize();
  if (reduce) still();
  else start();
  const ro = new ResizeObserver(() => {
    resize();
    if (reduce) still();
  });
  ro.observe(host);
  const io = new IntersectionObserver(
    (es) => {
      visible = es[0].isIntersecting;
      if (visible) start();
    },
    { rootMargin: "80px" }
  );
  io.observe(host);
  const onVis = () => {
    if (!document.hidden) start();
  };
  document.addEventListener("visibilitychange", onVis);
  const offTheme = onThemeChange(() => {
    col = readColors(o);
    if (reduce) still();
  });
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  const onMq = () => {
    reduce = mq.matches;
    if (reduce) still();
    else start();
  };
  mq.addEventListener("change", onMq);
  const onMove = (e: PointerEvent) => {
    const r = host.getBoundingClientRect();
    tpx = e.clientX - r.left;
    tpy = e.clientY - r.top;
  };
  const onLeave = () => {
    tpx = -1e4;
    tpy = -1e4;
  };
  zone.addEventListener("pointermove", onMove, { passive: true });
  zone.addEventListener("pointerleave", onLeave);

  return () => {
    cancelAnimationFrame(raf);
    raf = 0;
    ro.disconnect();
    io.disconnect();
    document.removeEventListener("visibilitychange", onVis);
    offTheme();
    mq.removeEventListener("change", onMq);
    zone.removeEventListener("pointermove", onMove);
    zone.removeEventListener("pointerleave", onLeave);
  };
}

/** Tilts `el`'s `.tilt` child (or `el`) toward the pointer while it moves over `zone`. */
export function mountTilt(zone: HTMLElement, el: HTMLElement, gx: number, gy: number): () => void {
  const t = (el.querySelector<HTMLElement>(".tilt") ?? el) as HTMLElement;
  const onMove = (e: PointerEvent) => {
    if (reduceMotion() || !finePointer()) return;
    const r = zone.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    t.style.setProperty("--ry", `${(x * gx).toFixed(2)}deg`);
    t.style.setProperty("--rx", `${(-y * gy).toFixed(2)}deg`);
  };
  const onLeave = () => {
    t.style.setProperty("--ry", "0deg");
    t.style.setProperty("--rx", "0deg");
  };
  zone.addEventListener("pointermove", onMove, { passive: true });
  zone.addEventListener("pointerleave", onLeave);
  return () => {
    zone.removeEventListener("pointermove", onMove);
    zone.removeEventListener("pointerleave", onLeave);
  };
}
