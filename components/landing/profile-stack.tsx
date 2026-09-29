"use client";

import { useEffect, useRef } from "react";
import { INTERVIEW_CONFIRM_BUSINESS_DAYS } from "@/lib/terms";
import { finePointer, clamp, reduceMotion } from "@/lib/theme";
import { NetBg } from "./net-bg";

// Example profiles, clearly labelled as such. Names, tiers and certifications are
// illustrative; the real bench shows real people.
const PROFILES = [
  { av: 1, initials: "AR", name: "Andrea R.", role: "Executive Assistant", tier: "Executive", years: 8, certs: ["Google Workspace", "Asana Certified Pro"] },
  { av: 2, initials: "PM", name: "Paolo M.", role: "Transaction Coordinator", tier: "Standard", years: 5, certs: ["Transaction Coordinator Certificate", "Dotloop"] },
  { av: 3, initials: "JT", name: "Joy T.", role: "Bookkeeper", tier: "Specialist", years: 6, certs: ["QuickBooks Online ProAdvisor", "Xero Advisor"] },
  { av: 4, initials: "MD", name: "Mika D.", role: "Property Management Assistant", tier: "Standard", years: 4, certs: ["AppFolio", "Fair Housing training"] },
];

/**
 * Orbit's fanned card stack. Cards cycle on click, arrow keys or the buttons, and the stack
 * tilts toward a fine pointer. It also advances on its own until someone touches it.
 */
export function ProfileStack() {
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = stage.current;
    if (!root) return;
    const stack = root.querySelector<HTMLElement>(".stack")!;
    const inner = root.querySelector<HTMLElement>(".stack-inner")!;
    const cards = Array.from(inner.querySelectorAll<HTMLElement>(".pcard"));
    const live = root.querySelector<HTMLElement>(".stack-live")!;
    const N = cards.length;
    const order = cards.map((_, i) => i);
    let busy = false;
    let touched = false;
    let inView = false;
    let auto = 0;
    const timers: number[] = [];
    const reduce = reduceMotion();

    function layout() {
      order.forEach((ci, depth) => {
        const c = cards[ci];
        c.style.setProperty("--d", String(depth));
        c.style.zIndex = String(10 - depth);
        c.classList.toggle("is-top", depth === 0);
        c.setAttribute("aria-hidden", depth === 0 ? "false" : "true");
      });
      live.textContent = cards[order[0]].dataset.name ?? "";
    }
    function next() {
      if (busy) return;
      busy = true;
      const topIdx = order[0];
      const top = cards[topIdx];
      top.classList.add("is-out");
      order.push(order.shift()!);
      order.forEach((ci, depth) => {
        if (ci !== topIdx) {
          cards[ci].style.setProperty("--d", String(depth));
          cards[ci].style.zIndex = String(10 - depth);
        }
      });
      timers.push(
        window.setTimeout(
          () => {
            top.style.transition = "none";
            top.classList.remove("is-out");
            top.style.setProperty("--d", String(N - 1));
            top.style.opacity = "0";
            void top.offsetWidth;
            top.style.transition = "";
            top.style.opacity = "";
            layout();
            timers.push(window.setTimeout(() => (busy = false), reduce ? 0 : 160));
          },
          reduce ? 0 : 380
        )
      );
    }
    function prev() {
      if (busy) return;
      busy = true;
      const lastIdx = order.pop()!;
      order.unshift(lastIdx);
      const c = cards[lastIdx];
      c.style.transition = "none";
      c.classList.add("is-out");
      void c.offsetWidth;
      c.style.transition = "";
      c.classList.remove("is-out");
      layout();
      timers.push(window.setTimeout(() => (busy = false), reduce ? 0 : 420));
    }
    function touch() {
      touched = true;
      window.clearInterval(auto);
    }
    layout();

    const onInnerClick = (e: MouseEvent) => {
      if ((e.target as Element).closest(".pcard.is-top")) {
        touch();
        next();
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowRight", "ArrowDown", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        touch();
        next();
      } else if (["ArrowLeft", "ArrowUp"].includes(e.key)) {
        e.preventDefault();
        touch();
        prev();
      }
    };
    const onNext = () => {
      touch();
      next();
    };
    const onPrev = () => {
      touch();
      prev();
    };
    inner.addEventListener("click", onInnerClick);
    stack.addEventListener("keydown", onKey);
    const nextBtn = root.querySelector<HTMLElement>(".stack-next")!;
    const prevBtn = root.querySelector<HTMLElement>(".stack-prev")!;
    nextBtn.addEventListener("click", onNext);
    prevBtn.addEventListener("click", onPrev);

    // Tilt: follows a fine pointer, otherwise sways gently.
    const BX = 7;
    const BY = -12;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let rafOn = false;
    function frame(t: number) {
      if (!finePointer()) {
        tx = Math.sin(t / 2600) * 5;
        ty = Math.cos(t / 3300) * 3;
      }
      cx += (tx - cx) * 0.075;
      cy += (ty - cy) * 0.075;
      inner.style.transform = `rotateX(${(BX + cy).toFixed(2)}deg) rotateY(${(BY + cx).toFixed(2)}deg)`;
      if (inView && !reduce && !document.hidden) requestAnimationFrame(frame);
      else rafOn = false;
    }
    function start() {
      if (!rafOn && !reduce) {
        rafOn = true;
        requestAnimationFrame(frame);
      }
    }
    const onMove = (e: PointerEvent) => {
      if (reduce || !finePointer()) return;
      const s = stack.getBoundingClientRect();
      const sx = (e.clientX - (s.left + s.width / 2)) / s.width;
      const sy = (e.clientY - (s.top + s.height / 2)) / s.height;
      tx = clamp(sx, -1.2, 1.2) * 10;
      ty = clamp(sy, -1.2, 1.2) * -7;
      start();
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
    };
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    const io = new IntersectionObserver(
      (es) => {
        inView = es[0].isIntersecting;
        if (inView) {
          start();
          if (!touched && !reduce && !auto) {
            auto = window.setInterval(() => {
              if (inView && !document.hidden) next();
            }, 4600);
          }
        }
      },
      { threshold: 0.4 }
    );
    io.observe(root);

    return () => {
      inner.removeEventListener("click", onInnerClick);
      stack.removeEventListener("keydown", onKey);
      nextBtn.removeEventListener("click", onNext);
      prevBtn.removeEventListener("click", onPrev);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      io.disconnect();
      window.clearInterval(auto);
      timers.forEach((t) => window.clearTimeout(t));
      inView = false;
    };
  }, []);

  return (
    <div className="stage" ref={stage}>
      <NetBg preset="stage" className="netbg-stage" />
      <span className="stage-label">Example profiles</span>
      <div
        className="stack"
        tabIndex={0}
        role="group"
        aria-roledescription="card stack"
        aria-label="Example VA profiles. Press the arrow keys or Enter to cycle through them."
      >
        <div className="stack-inner">
          <span className="floor" aria-hidden="true" />
          {PROFILES.map((p, i) => (
            <article className="pcard" key={p.name} data-name={`${p.name}, ${p.role}`}>
              <header className="pc-top">
                <span className="avatar" style={{ "--av": `var(--av-${p.av})` } as React.CSSProperties} aria-hidden="true">
                  {p.initials}
                </span>
                <div>
                  <h3 className="pc-name">{p.name}</h3>
                  <p className="pc-role">{p.role}</p>
                </div>
                <span className="tier">{p.tier}</span>
              </header>
              <span className="vetted">
                <svg className="ic" viewBox="0 0 16 16" aria-hidden="true">
                  <use href="#ic-check" />
                </svg>
                Vetted before listing
              </span>
              <dl className="pc-facts">
                <div>
                  <dt>Experience</dt>
                  <dd>{p.years} years</dd>
                </div>
                <div>
                  <dt>Tier</dt>
                  <dd>{p.tier}</dd>
                </div>
              </dl>
              <div className="pc-certs">
                <p>Certifications</p>
                <ul>
                  {p.certs.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
              <div className="pc-foot">
                <span>Example profile</span>
                <span>
                  {String(i + 1).padStart(2, "0")} / {String(PROFILES.length).padStart(2, "0")}
                </span>
              </div>
            </article>
          ))}
          <span className="float-chip fc-1" aria-hidden="true">
            <i />
            Interviews within {INTERVIEW_CONFIRM_BUSINESS_DAYS} business days
          </span>
          <span className="float-chip fc-2" aria-hidden="true">
            <i />
            No margin on your VA&apos;s pay
          </span>
        </div>
      </div>
      <div className="stack-ctrl">
        <button className="icon-btn stack-prev" type="button" aria-label="Previous example profile">
          <svg className="ic" viewBox="0 0 20 20" aria-hidden="true">
            <use href="#i-left" />
          </svg>
        </button>
        <span className="who stack-live" aria-live="polite">
          {PROFILES[0].name}, {PROFILES[0].role}
        </span>
        <button className="icon-btn stack-next" type="button" aria-label="Next example profile">
          <svg className="ic" viewBox="0 0 20 20" aria-hidden="true">
            <use href="#i-right" />
          </svg>
        </button>
      </div>
    </div>
  );
}
