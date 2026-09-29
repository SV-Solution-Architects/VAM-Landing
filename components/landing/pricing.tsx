"use client";

import { useEffect, useRef, useState } from "react";
import { START_BRIEF_URL, TERMS_URL } from "@/lib/site";
import { ACCESS_FEE, PLACEMENT_FEE, REPLACEMENT_DAYS, usd } from "@/lib/terms";
import { reduceMotion } from "@/lib/theme";
import { Arrow, Check } from "./brand-symbols";

// The Ledger mock's pricing: a tier switch, the two figures that matter, a dotted ledger,
// and the guarantee set like a certificate. Every number is a constant from lib/terms.ts.
const TIERS = [
  { key: "standard", name: "Standard", fee: PLACEMENT_FEE.Standard },
  { key: "executive", name: "Executive", fee: PLACEMENT_FEE.Executive },
  { key: "specialist", name: "Specialist", fee: PLACEMENT_FEE.Specialist },
] as const;
type TierKey = (typeof TIERS)[number]["key"];

/** Counts a displayed figure toward its target over about 700ms. */
function useCountTo(target: number) {
  const [shown, setShown] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    const start = from.current;
    if (start === target || reduceMotion()) {
      from.current = target;
      setShown(target);
      return;
    }
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / 700);
      const e = 1 - Math.pow(1 - p, 3);
      setShown(Math.round(start + (target - start) * e));
      if (p < 1) raf = requestAnimationFrame(tick);
      else from.current = target;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return shown;
}

export function Pricing() {
  const [tierKey, setTierKey] = useState<TierKey>("standard");
  const tier = TIERS.find((t) => t.key === tierKey)!;
  const fee = useCountTo(tier.fee);
  const due = useCountTo(tier.fee - ACCESS_FEE);

  return (
    <section className="band-sec tint" id="pricing" aria-labelledby="price-h">
      <div className="wrap">
        <div className="sec-head">
          <p className="eyebrow">Pricing</p>
          <h2 className="h2" id="price-h">
            Pay once, <em>when you hire.</em>
          </h2>
          <p className="sub">
            Opening the bench costs {usd(ACCESS_FEE)} per role. If you hire, that {usd(ACCESS_FEE)} comes off your placement fee. Your VA&apos;s
            monthly pay goes to them directly, with no margin added.
          </p>
        </div>
        <div className="pricing-grid">
          <div className="price-card">
            <fieldset className="seg" id="tier-seg">
              <legend className="vh">Placement tier</legend>
              {TIERS.map((t) => (
                <span key={t.key} style={{ display: "contents" }}>
                  <input type="radio" name="tier" id={`tier-${t.key}`} value={t.key} checked={tierKey === t.key} onChange={() => setTierKey(t.key)} />
                  <label htmlFor={`tier-${t.key}`}>{t.name}</label>
                </span>
              ))}
              <span className="seg-thumb" aria-hidden="true" />
            </fieldset>
            <div className="figs">
              <div className="fig">
                <span className="fig-label">One-time placement fee · {tier.name}</span>
                <span className="fig-num">{usd(fee)}</span>
              </div>
              <div className="fig fig--due">
                <span className="fig-label">At checkout after your {usd(ACCESS_FEE)} credit</span>
                <span className="fig-num">{usd(due)}</span>
              </div>
            </div>
            <p className="vh" aria-live="polite">
              {tier.name}: placement fee {usd(tier.fee)}, {usd(tier.fee - ACCESS_FEE)} at checkout after your {usd(ACCESS_FEE)} credit.
            </p>
            <div className="ledger" aria-label="Cost breakdown">
              <div className="lrow">
                <span className="lk">
                  <span>Marketplace access</span>
                  <small>Paid when you open the bench for a role</small>
                </span>
                <span className="dots" />
                <span className="lv">{usd(ACCESS_FEE)}</span>
              </div>
              <div className="lrow">
                <span className="lk">
                  <span>Placement fee, {tier.name}</span>
                  <small>One time, when you hire</small>
                </span>
                <span className="dots" />
                <span className="lv">{usd(fee)}</span>
              </div>
              <div className="lrow credit">
                <span className="lk">
                  <span>Access credit</span>
                </span>
                <span className="dots" />
                <span className="lv">−{usd(ACCESS_FEE)}</span>
              </div>
              <div className="lrow total">
                <span className="lk">
                  <span>Due at checkout</span>
                </span>
                <span className="dots" />
                <span className="lv">{usd(due)}</span>
              </div>
            </div>
            <p className="pay-note">
              <Check />
              <span>Your VA&apos;s monthly pay goes to your VA directly. Scale Virtually adds no margin.</span>
            </p>
            <div className="price-cta">
              <a className="btn btn-primary" href={START_BRIEF_URL} target="_blank" rel="noopener">
                Start your hiring brief
                <Arrow />
              </a>
              <a className="link-u" href={TERMS_URL} target="_blank" rel="noopener">
                Marketplace terms
              </a>
            </div>
          </div>

          <aside className="cert" aria-labelledby="cert-h">
            <div className="cert-inner">
              <div className="cert-top">
                <svg className="seal" viewBox="0 0 160 160" aria-hidden="true">
                  <defs>
                    <path id="seal-path" d="M80,80 m-60,0 a60,60 0 1,1 120,0 a60,60 0 1,1 -120,0" />
                  </defs>
                  <circle className="ring" cx="80" cy="80" r="77" />
                  <circle className="ring2" cx="80" cy="80" r="46" />
                  <g className="spin">
                    <text>
                      <textPath href="#seal-path" textLength="372" lengthAdjust="spacing">
                        {REPLACEMENT_DAYS}-DAY REPLACEMENT GUARANTEE · SCALE VIRTUALLY ·
                      </textPath>
                    </text>
                  </g>
                  <use href="#svmark" x="58" y="58" width="44" height="44" />
                </svg>
                <div>
                  <p className="eyebrow">Placement guarantee</p>
                  <h3 id="cert-h">{REPLACEMENT_DAYS}-day replacement guarantee</h3>
                </div>
              </div>
              <p className="cert-body">
                If your VA isn&apos;t the right fit within {REPLACEMENT_DAYS} days of their first working day, Scale Virtually finds a replacement
                at no extra placement fee.
              </p>
              <dl className="terms">
                <div>
                  <dt>Starts</dt>
                  <dd>Your VA&apos;s first working day</dd>
                </div>
                <div>
                  <dt>Replacement fee</dt>
                  <dd>No extra placement fee</dd>
                </div>
                <div>
                  <dt>One exception</dt>
                  <dd>Mistreatment of the VA</dd>
                </div>
                <div>
                  <dt>Term</dt>
                  <dd>A guarantee, not a minimum term</dd>
                </div>
              </dl>
              <div className="cert-sign">
                <div>
                  <span className="sn">Scale Virtually</span>
                  <small>Placements team</small>
                </div>
                <span className="no">
                  Every placement
                  <br />
                  {REPLACEMENT_DAYS} days
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
