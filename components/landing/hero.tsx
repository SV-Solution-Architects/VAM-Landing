import { INTERVIEW_CAP, INTERVIEW_CONFIRM_BUSINESS_DAYS, MAX_SHORTLIST, REPLACEMENT_DAYS } from "@/lib/terms";
import { StartBriefLink } from "./cta";
import { HeroSphere } from "./hero-sphere";

export function Hero() {
  return (
    <HeroSphere>
      <div className="hero-inner">
        <p className="chip">
          <span className="chip-ic" aria-hidden="true">
            <svg viewBox="0 0 16 16">
              <use href="#ic-check" />
            </svg>
          </span>
          <span>
            Vetted before listing <span className="sep">·</span> {REPLACEMENT_DAYS}-day replacement guarantee
          </span>
        </p>
        <h1 id="hero-title">
          <span>Your next VA is</span> <span>already vetted.</span>
        </h1>
        <p className="lede">
          Browse vetted virtual assistants the same day you open the bench. Shortlist up to {MAX_SHORTLIST === 3 ? "three" : MAX_SHORTLIST}, and
          each interview request is confirmed within {INTERVIEW_CONFIRM_BUSINESS_DAYS} business days.
        </p>
        <div className="cta-row">
          <StartBriefLink />
          <a className="btn btn-ghost" href="#stories">
            <svg className="ic" viewBox="0 0 20 20" aria-hidden="true">
              <circle cx="10" cy="10" r="7.5" />
              <path d="M8.5 7.2v5.6l4.4-2.8z" fill="currentColor" stroke="none" />
            </svg>
            Watch client stories
          </a>
        </div>
        <ul className="facts-strip" aria-label="Service facts">
          <li>
            <strong>Same day</strong>
            <span>browse the bench</span>
          </li>
          <li>
            <strong>{INTERVIEW_CONFIRM_BUSINESS_DAYS} business days</strong>
            <span>to confirm interviews</span>
          </li>
          <li>
            <strong>Up to {INTERVIEW_CAP}</strong>
            <span>interviews per role</span>
          </li>
          <li>
            <strong>{REPLACEMENT_DAYS} days</strong>
            <span>replacement guarantee</span>
          </li>
        </ul>
      </div>
    </HeroSphere>
  );
}
