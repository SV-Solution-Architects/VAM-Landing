import { HERO_STORY } from "@/lib/stories";
import { INTERVIEW_CAP, INTERVIEW_CONFIRM_BUSINESS_DAYS, REPLACEMENT_DAYS } from "@/lib/terms";
import { Check } from "./brand-symbols";
import { CompareSlider } from "./compare-slider";
import { ProfileStack } from "./profile-stack";
import { StoryThumb } from "./story-thumb";

// Two rows. At desktop widths the visual stays pinned while its copy scrolls past; on
// narrower screens they stack.
export function Benefits() {
  return (
    <section className="band-sec" id="benefits" aria-labelledby="benefits-title">
      <div className="wrap">
        <div className="sec-head">
          <p className="eyebrow">What you get</p>
          <h2 className="h2" id="benefits-title">
            Vetted people, visible up front.
          </h2>
          <p className="sub">
            Every profile on the bench was vetted before listing, and every hire comes with the same terms: interviews confirmed within{" "}
            {INTERVIEW_CONFIRM_BUSINESS_DAYS} business days, no margin on your VA&apos;s pay, and a {REPLACEMENT_DAYS}-day replacement guarantee.
          </p>
        </div>
        <div className="scrolly">
          <div className="story-row">
            <div className="copy">
              <span className="idx">01 · Vetted before listing</span>
              <h3 className="h2 sm">Compare people, not résumés.</h3>
              <p className="sub">
                Each profile shows years of experience, tier and role-specific certifications. Shortlist up to three at a time, and our
                placements team confirms each interview request within {INTERVIEW_CONFIRM_BUSINESS_DAYS} business days.
              </p>
              <ul className="checks" style={{ justifyContent: "flex-start" }}>
                <li>
                  <Check />
                  Experience and certifications on every profile
                </li>
                <li>
                  <Check />
                  Up to {INTERVIEW_CAP} interview requests per role
                </li>
              </ul>
            </div>
            <div className="visual">
              <ProfileStack />
            </div>
          </div>
          <div className="story-row">
            <div className="copy">
              <span className="idx">02 · Results within days</span>
              <h3 className="h2 sm">From 5,400 unopened emails to on track and on task.</h3>
              <div className="quote-card">
                <p>&ldquo;{HERO_STORY.quote}&rdquo;</p>
                <div className="attrib">
                  <StoryThumb story={HERO_STORY} />
                  <span>
                    <strong>{HERO_STORY.name}</strong>
                    <span>
                      {HERO_STORY.role}, {HERO_STORY.company}
                    </span>
                  </span>
                </div>
              </div>
              <p className="note">
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <use href="#i-info" />
                </svg>
                <span>An illustration of Aaron&apos;s own words, not a screenshot of his inbox. Drag the handle, or focus it and use the arrow keys.</span>
              </p>
            </div>
            <div className="visual">
              <CompareSlider />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
