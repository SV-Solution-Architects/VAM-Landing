"use client";

import { useEffect, useRef } from "react";
import { START_BRIEF_URL } from "@/lib/site";
import { INTERVIEW_CONFIRM_BUSINESS_DAYS } from "@/lib/terms";
import { mountTilt } from "@/lib/net";
import { clamp, reduceMotion } from "@/lib/theme";

/** Scale Virtually's line, as Aja gave it on 29 Sep 2026: full stops, and "Smarter". */
const SLOGAN = ["Scale Smarter.", "Scale Faster."];

/**
 * The closing band from the Coverflow mock: near-black in both themes, the first two lines
 * dimmed and the brand line lit, the flat mark floating over a faint reflection. The mark
 * tilts toward the pointer and turns into place as the band scrolls in.
 */
export function Closing() {
  const band = useRef<HTMLDivElement>(null);
  const mark = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const b = band.current;
    const m = mark.current;
    if (!b || !m) return;
    const offTilt = mountTilt(b, m, 18, 10);
    const tilt = m.querySelector<HTMLElement>(".tilt")!;
    const reveal = () => {
      if (reduceMotion()) return;
      const r = b.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = clamp(1 - (r.top - vh * 0.15) / (vh * 0.7), 0, 1);
      tilt.style.setProperty("--s", (0.82 + 0.18 * p).toFixed(3));
      tilt.style.setProperty("--sy", `${((1 - p) * -28).toFixed(2)}deg`);
    };
    window.addEventListener("scroll", reveal, { passive: true });
    window.addEventListener("resize", reveal);
    reveal();
    return () => {
      offTilt();
      window.removeEventListener("scroll", reveal);
      window.removeEventListener("resize", reveal);
    };
  }, []);

  return (
    <section className="closing" id="start" aria-labelledby="slogan">
      <div className="wrap">
        <div className="cta-band" ref={band}>
          <div className="cta-copy">
            <h2 className="slogan" id="slogan">
              {SLOGAN.map((line) => (
                <span key={line}>{line}</span>
              ))}
              <span>
                Scale <em className="o">Virtually.</em>
              </span>
            </h2>
            <p>
              Answer four questions today. <b>Interviews are confirmed within {INTERVIEW_CONFIRM_BUSINESS_DAYS} business days</b> of each request.
            </p>
            <a className="btn btn-primary" href={START_BRIEF_URL} target="_blank" rel="noopener">
              Start your hiring brief
              <svg className="ic" viewBox="0 0 18 18" aria-hidden="true">
                <path d="M4 14 14 4M6.5 4H14v7.5" />
              </svg>
            </a>
          </div>
          <div className="mark3d" ref={mark} aria-hidden="true">
            <div className="tilt">
              <div className="floater">
                <svg className="mark" viewBox="0 0 494 506">
                  <use href="#svmark" />
                </svg>
                <svg className="mark reflection" viewBox="0 0 494 506">
                  <use href="#svmark" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
