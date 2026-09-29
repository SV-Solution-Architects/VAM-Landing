"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { clipUrl, posterUrl, type Story } from "@/lib/stories";
import { reduceMotion } from "@/lib/theme";
import { NetBg } from "./net-bg";
import { StoryDialog } from "./story-dialog";

// How each still is framed: a few recordings are letterboxed, so they get a slight zoom.
// Aaron's recording carries an editor's pull-quote across the top for a few seconds around
// the quote, and 1.3 crops it out of the silent preview; the full video keeps it.
const FRAME: Record<string, { z: number; o: string }> = {
  "jesse-hallstrom": { z: 1.3, o: "50% 100%" },
  "aaron-bogie": { z: 1.3, o: "50% 50%" },
};
const DEFAULT_FRAME = { z: 1.2, o: "50% 50%" };
const ALT: Record<string, string> = { "jesse-hallstrom": "Two people from Hempel Real Estate speaking on camera" };
const START = 1; // Aaron Bogie leads: one speaker and a concrete result.
const INTERVAL = 6500;
const mod = (a: number, n: number) => ((a % n) + n) % n;

type Engine = { step: (d: number, user: boolean) => void; goTo: (i: number, user: boolean) => void; pause: (key: string, on: boolean) => void };

/**
 * Coverflow's carousel: the centre clip sharp and playing a silent preview, the others
 * receding either side. Drag or swipe, use the arrows, dots or arrow keys; it advances on
 * its own until you interact. The centre card opens the full video with sound.
 */
export function Coverflow({ stories }: { stories: Story[] }) {
  const N = stories.length;
  const stageRef = useRef<HTMLDivElement>(null);
  const capRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLElement | null)[]>([]);
  const engine = useRef<Engine | null>(null);
  const [idx, setIdx] = useState(START);
  const [centre, setCentre] = useState(START);
  const [userPaused, setUserPaused] = useState(false);
  const [dialog, setDialog] = useState<Story | null>(null);
  const [status, setStatus] = useState("");
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    const rm = reduceMotion();
    setReduce(rm);
    const s = { pos: START, target: START, W: 600, K1: 0.66, K2: 0.4, elapsed: 0, last: 0, idx: START, centre: START, raf: 0, dragging: false, moved: false, sx: 0, sp: 0, lx: 0, lt: 0, vx: 0, pid: null as number | null, eat: false };
    const paused: Record<string, boolean> = { user: rm };
    const anyPaused = () => Object.values(paused).some(Boolean);

    function measure() {
      s.W = cards[0]?.offsetWidth || 600;
      const narrow = window.innerWidth < 760;
      s.K1 = narrow ? 0.6 : 0.66;
      s.K2 = narrow ? 0.34 : 0.4;
    }
    function render() {
      for (let i = 0; i < N; i++) {
        const el = cards[i];
        if (!el) continue;
        let o = mod(i - s.pos, N);
        if (o > N / 2) o -= N;
        const a = Math.abs(o);
        const sg = Math.sign(o);
        const x = sg * (Math.min(a, 1) * s.K1 + Math.max(a - 1, 0) * s.K2) * s.W;
        const z = -Math.min(a, 3) * 160;
        const ry = -sg * Math.min(a, 1) * 30;
        const sc = 1 - Math.min(a, 2) * 0.06;
        const bl = Math.min(a, 2) * 2.6;
        const op = a <= 1 ? 1 : a <= 2 ? 1 - (a - 1) * 0.4 : Math.max(0, 0.6 - (a - 2) * 1.2);
        el.style.transform = `translate3d(${x.toFixed(1)}px,0,${z.toFixed(1)}px) rotateY(${ry.toFixed(2)}deg) scale(${sc.toFixed(3)})`;
        el.style.filter = bl > 0.05 ? `blur(${bl.toFixed(2)}px)` : "none";
        el.style.opacity = op.toFixed(3);
        el.style.zIndex = String(100 - Math.round(a * 10));
        el.style.visibility = op < 0.01 ? "hidden" : "visible";
      }
      const c = mod(Math.round(s.pos), N);
      if (c !== s.centre) {
        s.centre = c;
        setCentre(c);
      }
    }
    function setIndex(i: number) {
      if (i === s.idx) return;
      s.idx = i;
      setIdx(i);
      if (!rm && capRef.current?.animate) {
        capRef.current.animate([{ opacity: 0.15, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 460, easing: "cubic-bezier(.2,.8,.2,1)" });
      }
    }
    const announce = () => setStatus(`Story ${s.idx + 1} of ${N}: ${stories[s.idx].name}`);
    function step(d: number, user: boolean) {
      s.target = Math.round(s.target) + d;
      setIndex(mod(s.target, N));
      s.elapsed = 0;
      if (rm) {
        s.pos = s.target;
        render();
      }
      if (user) announce();
    }
    function goTo(i: number, user: boolean) {
      const cur = mod(Math.round(s.target), N);
      let d = i - cur;
      if (d > N / 2) d -= N;
      if (d < -N / 2) d += N;
      if (d) step(d, user);
    }
    engine.current = { step, goTo, pause: (key, on) => (paused[key] = on) };

    function frame(ts: number) {
      const dt = s.last ? Math.min(50, ts - s.last) : 16;
      s.last = ts;
      if (!s.dragging && s.pos !== s.target) {
        const d = s.target - s.pos;
        if (Math.abs(d) < 0.0008) s.pos = s.target;
        else s.pos += d * (1 - Math.exp(-dt / 120));
        render();
      }
      if (!anyPaused()) {
        s.elapsed += dt;
        if (s.elapsed >= INTERVAL) {
          s.elapsed = 0;
          step(1, false);
        }
      }
      const p = Math.min(1, s.elapsed / INTERVAL).toFixed(4);
      const di = dotRefs.current[s.idx];
      if (di) di.style.transform = `scaleX(${p})`;
      s.raf = requestAnimationFrame(frame);
    }

    // Drag and swipe.
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      s.dragging = true;
      s.moved = false;
      s.eat = false;
      s.sx = s.lx = e.clientX;
      s.sp = s.pos;
      s.lt = performance.now();
      s.vx = 0;
      s.pid = e.pointerId;
      paused.drag = true;
    };
    const onMove = (e: PointerEvent) => {
      if (!s.dragging || e.pointerId !== s.pid) return;
      const dx = e.clientX - s.sx;
      if (!s.moved && Math.abs(dx) > 6) {
        s.moved = true;
        try {
          stage.setPointerCapture(s.pid);
        } catch {
          // Capture can be refused; the drag still tracks the pointer.
        }
        stage.classList.add("dragging");
      }
      if (s.moved) {
        const now = performance.now();
        s.vx = 0.75 * s.vx + 0.25 * ((e.clientX - s.lx) / Math.max(1, now - s.lt));
        s.lx = e.clientX;
        s.lt = now;
        s.pos = s.sp - dx / (s.K1 * s.W);
        s.target = s.pos;
        render();
        setIndex(mod(Math.round(s.pos), N));
      }
    };
    const endDrag = (e: PointerEvent) => {
      if (!s.dragging || e.pointerId !== s.pid) return;
      s.dragging = false;
      paused.drag = false;
      stage.classList.remove("dragging");
      if (s.moved) {
        s.eat = true;
        let t = Math.round(s.pos - (s.vx * 160) / (s.K1 * s.W));
        t = Math.max(Math.round(s.sp) - 2, Math.min(Math.round(s.sp) + 2, t));
        s.target = t;
        s.elapsed = 0;
        setIndex(mod(t, N));
        if (rm) {
          s.pos = s.target;
          render();
        }
        announce();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (s.eat) {
        s.eat = false;
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      const card = (e.target as Element).closest<HTMLElement>(".cf-card");
      if (!card) return;
      const i = +card.dataset.i!;
      if (i === s.centre) setDialog(stories[i]);
      else goTo(i, true);
    };
    const onDragStart = (e: Event) => e.preventDefault();
    const onEnter = (e: PointerEvent) => {
      if (e.pointerType === "mouse") paused.hover = true;
    };
    const onLeave = () => (paused.hover = false);
    const onFocusIn = () => (paused.focus = true);
    const onFocusOut = (e: FocusEvent) => {
      if (!stage.contains(e.relatedTarget as Node)) paused.focus = false;
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        step(-1, true);
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        step(1, true);
      }
    };
    const onVis = () => (paused.hidden = document.hidden);
    const onResize = () => {
      measure();
      render();
    };
    stage.addEventListener("pointerdown", onDown);
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerup", endDrag);
    stage.addEventListener("pointercancel", endDrag);
    stage.addEventListener("click", onClick);
    stage.addEventListener("dragstart", onDragStart);
    stage.addEventListener("pointerenter", onEnter);
    stage.addEventListener("pointerleave", onLeave);
    stage.addEventListener("focusin", onFocusIn);
    stage.addEventListener("focusout", onFocusOut);
    stage.addEventListener("keydown", onKey);
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("resize", onResize);
    const io = new IntersectionObserver((es) => (paused.offscreen = !es[0].isIntersecting), { threshold: 0.2 });
    io.observe(stage);
    document.fonts?.ready.then(onResize);

    measure();
    render();
    s.raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(s.raf);
      engine.current = null;
      stage.removeEventListener("pointerdown", onDown);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerup", endDrag);
      stage.removeEventListener("pointercancel", endDrag);
      stage.removeEventListener("click", onClick);
      stage.removeEventListener("dragstart", onDragStart);
      stage.removeEventListener("pointerenter", onEnter);
      stage.removeEventListener("pointerleave", onLeave);
      stage.removeEventListener("focusin", onFocusIn);
      stage.removeEventListener("focusout", onFocusOut);
      stage.removeEventListener("keydown", onKey);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", onResize);
      io.disconnect();
    };
  }, [N, stories]);

  // The dialog pauses autoplay while it is open.
  useEffect(() => {
    engine.current?.pause("lightbox", dialog !== null);
  }, [dialog]);

  const current = stories[idx];

  return (
    <>
      <div className="cf" id="stories" role="region" aria-roledescription="carousel" aria-label="Client stories">
        <div
          className="cf-stage"
          ref={stageRef}
          tabIndex={0}
          aria-label="Client clips. Use the left and right arrow keys to move between stories."
        >
          <NetBg preset="cf" className="netbg-cf" />
          {stories.map((story, i) => {
            const fr = FRAME[story.id] ?? DEFAULT_FRAME;
            const alt = ALT[story.id] ?? `${story.name} speaking on camera`;
            const isCentre = centre === i;
            return (
              <div
                className={`cf-card${isCentre ? " is-center" : ""}`}
                key={story.id}
                data-i={i}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${N}: ${story.name}`}
                aria-hidden={!isCentre}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
              >
                <div className="cf-bezel">
                  <div className="cf-media" style={{ "--z": fr.z, "--o": fr.o } as React.CSSProperties}>
                    <Image
                      className="cf-still"
                      src={posterUrl(story, 960)}
                      alt={alt}
                      fill
                      unoptimized
                      sizes="(min-width: 760px) 600px, 100vw"
                      placeholder="blur"
                      blurDataURL={story.video.blurDataURL}
                      draggable={false}
                    />
                    {isCentre && !reduce && <Image className="cf-clip" src={clipUrl(story, 640)} alt="" fill unoptimized draggable={false} />}
                  </div>
                  <button
                    className="cf-play"
                    type="button"
                    tabIndex={isCentre ? 0 : -1}
                    aria-label={`Play ${story.name}'s clip, ${story.duration}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setDialog(story);
                    }}
                  >
                    <i>
                      <svg viewBox="0 0 12 12" aria-hidden="true">
                        <use href="#i-play" />
                      </svg>
                    </i>
                    <span>{story.duration}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <button className="cf-arrow cf-prev" type="button" aria-label="Previous story" onClick={() => engine.current?.step(-1, true)}>
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <use href="#i-left" />
          </svg>
        </button>
        <button className="cf-arrow cf-next" type="button" aria-label="Next story" onClick={() => engine.current?.step(1, true)}>
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <use href="#i-right" />
          </svg>
        </button>
        <div className="cf-controls">
          <div
            className="cf-dots"
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
                e.preventDefault();
                engine.current?.step(e.key === "ArrowLeft" ? -1 : 1, true);
              }
            }}
          >
            {stories.map((story, i) => (
              <button
                key={story.id}
                type="button"
                className="cf-dot"
                aria-label={`Show ${story.name}'s story`}
                aria-current={idx === i ? "true" : "false"}
                onClick={() => engine.current?.goTo(i, true)}
              >
                <span>
                  <i
                    ref={(el) => {
                      dotRefs.current[i] = el;
                    }}
                  />
                </span>
              </button>
            ))}
          </div>
          <button
            className={`cf-pause${userPaused ? " is-paused" : ""}`}
            type="button"
            aria-label={userPaused ? "Play autoplay" : "Pause autoplay"}
            onClick={() => {
              const next = !userPaused;
              setUserPaused(next);
              engine.current?.pause("user", next);
            }}
          >
            <svg className="i-pause" viewBox="0 0 12 12" aria-hidden="true">
              <rect x="2" y="1.5" width="2.6" height="9" rx="1" />
              <rect x="7.4" y="1.5" width="2.6" height="9" rx="1" />
            </svg>
            <svg className="i-play" viewBox="0 0 12 12" aria-hidden="true">
              <path d="M3 1.6v8.8L10.4 6z" />
            </svg>
            <span className="lbl">{userPaused ? "Play" : "Pause"}</span>
          </button>
        </div>
        <div className="cf-caption" ref={capRef}>
          <p className="cf-theme">{current.theme}</p>
          <blockquote className="cf-quote">&ldquo;{current.quote}&rdquo;</blockquote>
          <p className="cf-who">
            <b>{current.name}</b> · {current.role}, {current.company}
          </p>
          <p className="cf-note">Scale Virtually clients, filmed before VA Marketplace launched.</p>
        </div>
        <p className="vh" aria-live="polite">
          {status}
        </p>
      </div>
      <StoryDialog story={dialog} open={dialog !== null} onOpenChange={(open) => !open && setDialog(null)} />
    </>
  );
}
