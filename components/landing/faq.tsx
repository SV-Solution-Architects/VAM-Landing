import { START_BRIEF_URL } from "@/lib/site";
import { ACCESS_FEE, INTERVIEW_CAP, INTERVIEW_CONFIRM_BUSINESS_DAYS, MAX_SHORTLIST, REPLACEMENT_DAYS, usd } from "@/lib/terms";
import { Arrow } from "./brand-symbols";

// Answers restate the marketplace terms, including the one exception to the guarantee,
// so nothing here promises more than the agreement a client accepts.
const FAQS = [
  {
    q: `What does the ${usd(ACCESS_FEE)} cover?`,
    a: `Every vetted profile for one role, and up to ${INTERVIEW_CAP} interview requests, for one hire. It's credited toward your placement fee if you hire, so it comes off the cost of the hire rather than sitting on top of it.`,
  },
  {
    q: "How quickly can I interview someone?",
    a: `You can browse the bench as soon as you've signed up and opened it. Shortlist up to ${MAX_SHORTLIST} people and our placements team confirms each interview request within ${INTERVIEW_CONFIRM_BUSINESS_DAYS} business days.`,
  },
  {
    q: "How are the VAs vetted?",
    a: "Scale Virtually vets every VA before their profile goes live. Each profile shows their years of experience and role-specific certifications, so you can compare people at a glance instead of digging through résumés.",
  },
  {
    q: "Who pays the VA?",
    a: "You do, directly, at the monthly rate set in your placement agreement. Scale Virtually doesn't collect it and adds no margin to it.",
  },
  {
    q: "What if my VA isn't the right fit?",
    a: `Tell us within ${REPLACEMENT_DAYS} days of their first working day and we find a replacement at no extra placement fee, for any reason other than mistreatment. It's a guarantee, not a minimum term: you don't have to keep them for ${REPLACEMENT_DAYS} days.`,
  },
  {
    q: "Can I hire more than one VA?",
    a: `Yes. Each role is its own engagement with its own ${usd(ACCESS_FEE)} access payment, and each VA you place has their own placement fee.`,
  },
];

export function Faq() {
  return (
    <section className="band-sec" id="faq" aria-labelledby="faq-title">
      <div className="wrap">
        <div className="faq">
          <div className="faq-side">
            <p className="eyebrow">FAQ</p>
            <h2 className="h2" id="faq-title">
              Questions owners ask.
            </h2>
            <p className="sub">Straight answers, taken from the marketplace terms.</p>
            <a className="btn btn-ghost" href={START_BRIEF_URL} target="_blank" rel="noopener">
              Start your hiring brief
              <Arrow />
            </a>
          </div>
          <div className="qa-list">
            {FAQS.map((item, i) => (
              <details className="qa" key={item.q} open={i === 0}>
                <summary>
                  {item.q}
                  <span className="pm" aria-hidden="true" />
                </summary>
                <div className="qa-body">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
