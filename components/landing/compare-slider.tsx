"use client";

import { useEffect, useRef } from "react";
import { reduceMotion } from "@/lib/theme";

const MAIL_WIDTHS: [number, number][] = [
  [46, 82],
  [38, 70],
  [52, 76],
  [30, 88],
  [44, 64],
  [36, 80],
  [50, 72],
  [40, 84],
];

/**
 * Orbit's before/after: Aaron Bogie's 5,400 unopened emails on the left, a task board on
 * the right, and a handle between them. It sweeps once when it scrolls into view, then
 * waits for the visitor. An illustration of his words, not a screenshot.
 */
export function CompareSlider() {
  const cmp = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = cmp.current;
    if (!el) return;
    const range = el.querySelector<HTMLInputElement>('input[type="range"]')!;
    let touched = false;
    let raf = 0;
    const setPos = (v: number) => {
      el.style.setProperty("--pos", `${v}%`);
      range.setAttribute("aria-valuetext", `${Math.round(v)}% inbox shown, ${100 - Math.round(v)}% task board shown`);
    };
    const onInput = () => {
      touched = true;
      setPos(+range.value);
    };
    range.addEventListener("input", onInput);
    setPos(50);
    const io = new IntersectionObserver(
      (es) => {
        if (!es[0].isIntersecting) return;
        io.disconnect();
        if (reduceMotion() || touched) return;
        const keys: [number, number][] = [
          [0, 50],
          [700, 26],
          [1500, 70],
          [2200, 50],
        ];
        const t0 = performance.now();
        const ease = (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
        const tick = (now: number) => {
          if (touched) return;
          const t = now - t0;
          let v = 50;
          for (let k = 1; k < keys.length; k++) {
            if (t <= keys[k][0]) {
              const a = keys[k - 1];
              const b = keys[k];
              v = a[1] + (b[1] - a[1]) * ease((t - a[0]) / (b[0] - a[0]));
              break;
            }
            v = keys[k][1];
          }
          range.value = String(v);
          setPos(v);
          if (t < 2200) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.55 }
    );
    io.observe(el);
    return () => {
      range.removeEventListener("input", onInput);
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const check = (
    <span className="ck on">
      <svg className="ic" viewBox="0 0 16 16" aria-hidden="true">
        <use href="#ic-check" />
      </svg>
    </span>
  );

  return (
    <div className="compare" ref={cmp}>
      <div className="cmp-layer cmp-after" aria-hidden="true">
        <div className="cmp-bar">
          <span className="t">Tasks</span>
          <span className="pill g">On track</span>
        </div>
        <div className="board">
          <div className="col">
            <h4>To do</h4>
            <div className="task">
              <div className="row">
                <span className="ck" />
                <span className="sk b" style={{ width: "70%" }} />
              </div>
              <span className="sk" style={{ width: "48%" }} />
            </div>
            <div className="task">
              <div className="row">
                <span className="ck" />
                <span className="sk b" style={{ width: "58%" }} />
              </div>
              <span className="sk" style={{ width: "62%" }} />
            </div>
          </div>
          <div className="col">
            <h4>In progress</h4>
            <div className="task">
              <div className="row">
                <span className="ck half" />
                <span className="sk b" style={{ width: "66%" }} />
              </div>
              <span className="sk" style={{ width: "40%" }} />
            </div>
            <div className="task">
              <div className="row">
                <span className="ck half" />
                <span className="sk b" style={{ width: "52%" }} />
              </div>
              <span className="sk" style={{ width: "58%" }} />
            </div>
          </div>
          <div className="col">
            <h4>Done</h4>
            {[
              [62, 44],
              [74, 36],
              [54, 50],
            ].map(([a, b]) => (
              <div className="task" key={a}>
                <div className="row">
                  {check}
                  <span className="sk b" style={{ width: `${a}%` }} />
                </div>
                <span className="sk" style={{ width: `${b}%` }} />
              </div>
            ))}
          </div>
        </div>
        <span className="cmp-tag">Within a matter of days: on track and on task</span>
      </div>
      <div className="cmp-layer cmp-before" aria-hidden="true">
        <div className="cmp-bar">
          <span className="t">Inbox</span>
          <span className="pill o">5,400 unopened</span>
        </div>
        <div className="inbox">
          {MAIL_WIDTHS.map(([a, b], i) => (
            <div className="mail" key={i}>
              <span className="dot" />
              <span className="face" />
              <span className="lines">
                <span className="sk b" style={{ width: `${a}%` }} />
                <span className="sk" style={{ width: `${b}%` }} />
              </span>
              <span className="flag">Unread</span>
            </div>
          ))}
        </div>
        <span className="cmp-tag">Before: 5,400 unopened emails</span>
      </div>
      <div className="cmp-handle" aria-hidden="true">
        <span className="knob">
          <svg viewBox="0 0 24 24">
            <path d="M9 7l-5 5 5 5M15 7l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
      <label className="vh" htmlFor="cmp-range">
        Compare before and after. Lower values show more of the inbox, higher values show more of the task board.
      </label>
      <input type="range" id="cmp-range" min="0" max="100" defaultValue="50" step="1" />
    </div>
  );
}
