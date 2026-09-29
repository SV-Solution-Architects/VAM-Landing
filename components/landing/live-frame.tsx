"use client";

import { useEffect, useRef } from "react";
import { reduceMotion } from "@/lib/theme";

type Kind = "brief" | "bench" | "shortlist" | "sign" | "guarantee";

/**
 * A frame around an example window in "How it works". When it scrolls into view the window
 * plays its small sequence once (a chip toggles, a shortlist fills, a request confirms, a
 * signature draws); the resting state is the finished state, so nothing depends on it.
 * The window also drifts a little with the scroll.
 */
export function LiveFrame({ kind, note, children }: { kind: Kind; note: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = reduceMotion();
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));
    const scripts: Partial<Record<Kind, () => void>> = {
      brief() {
        const chip = el.querySelector("[data-chip-target]");
        const why = el.querySelector(".bf-why");
        const count = el.querySelector(".count b");
        later(() => {
          chip?.classList.add("on");
          if (why) why.textContent = "Worked out from 3 tasks, about 20 hours a week.";
        }, 1300);
        later(() => {
          if (count) {
            count.textContent = "2";
            count.parentElement?.classList.add("bump");
          }
        }, 2300);
      },
      bench() {
        const btn = el.querySelector("[data-sl-target]");
        const count = el.querySelector(".bench-count");
        later(() => {
          btn?.classList.add("on");
          const label = btn?.querySelector("span");
          if (label) label.textContent = "Shortlisted";
          if (count) {
            count.textContent = "2";
            count.parentElement?.classList.add("bump");
          }
        }, 1300);
      },
      shortlist() {
        const req = el.querySelector<HTMLElement>(".req");
        const pill = el.querySelector(".req-pill");
        req?.setAttribute("data-state", "pending");
        if (pill) pill.textContent = "Awaiting confirmation";
        later(() => {
          req?.setAttribute("data-state", "confirmed");
          if (pill) pill.textContent = "Confirmed";
        }, 1200);
      },
    };
    let io: IntersectionObserver | undefined;
    if (!reduce) {
      io = new IntersectionObserver(
        (es) => {
          if (!es[0].isIntersecting) return;
          io?.disconnect();
          el.classList.add("is-live");
          scripts[kind]?.();
        },
        { threshold: 0.4 }
      );
      io.observe(el);
    }
    const win = el.querySelector<HTMLElement>("[data-parallax]");
    let ticking = false;
    const run = () => {
      ticking = false;
      if (!win) return;
      const vh = window.innerHeight;
      const r = el.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      const c = (r.top + r.height / 2 - vh / 2) / vh;
      const amp = parseFloat(win.getAttribute("data-parallax") || "20");
      win.style.transform = `translate3d(0,${(-c * amp).toFixed(1)}px,0)`;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(run);
      }
    };
    if (!reduce && win) {
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", run);
      run();
    }
    return () => {
      io?.disconnect();
      timers.forEach((t) => window.clearTimeout(t));
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", run);
    };
  }, [kind]);

  return (
    <div className="frame" data-live={kind} ref={ref}>
      {children}
      <span className="frame-note mono">{note}</span>
    </div>
  );
}
