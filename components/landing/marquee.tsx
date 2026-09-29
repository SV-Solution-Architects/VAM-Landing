"use client";

import { useState } from "react";

// The six client businesses from the stories, set as wordmarks. They scroll slowly and
// stop on hover or on the button; reduced-motion users get them as a wrapped row.
const MARKS = (
  <>
    <li className="wm wm-a">
      <b>HEMPEL</b>
      <span>Real Estate</span>
    </li>
    <li className="wm wm-b">
      <i>The Property Center</i>
    </li>
    <li className="wm wm-c">POSSELT REAL ESTATE</li>
    <li className="wm wm-d">
      <b>Peace of Mind</b>
      <span>Property Management</span>
    </li>
    <li className="wm wm-e">
      <b>FORESITE</b>
      <span>Capital Partners</span>
    </li>
    <li className="wm wm-f">
      <b>continuum</b>
      <span>capital funding</span>
    </li>
  </>
);

export function Marquee() {
  const [paused, setPaused] = useState(false);
  return (
    <section className="marks" aria-label="Businesses that hired through Scale Virtually">
      <div className="wrap">
        <div className={`marquee${paused ? " paused" : ""}`}>
          <div className="mq-top">
            <p className="eyebrow">Businesses that hired through Scale Virtually</p>
            <button type="button" className="mq-pause" aria-pressed={paused} onClick={() => setPaused((p) => !p)}>
              <svg viewBox="0 0 10 10" aria-hidden="true">
                <rect x="1.5" y="1" width="2.4" height="8" rx=".6" />
                <rect x="6.1" y="1" width="2.4" height="8" rx=".6" />
              </svg>
              <span>{paused ? "Play" : "Pause"}</span>
            </button>
          </div>
          <div className="mq-view">
            <div className="mq-track">
              <ul className="mq-list">{MARKS}</ul>
              <ul className="mq-list" aria-hidden="true">
                {MARKS}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
