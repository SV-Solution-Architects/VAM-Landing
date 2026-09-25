import {
  ACCESS_FEE,
  INTERVIEW_CONFIRM_BUSINESS_DAYS,
  MAX_SHORTLIST,
  REPLACEMENT_DAYS,
  usd,
} from "@/lib/terms";

// The journey the app actually runs (sign up, brief, pay to open the bench, shortlist,
// interviews booked by Placements, hire), in the app's own words where it has them.
const STEPS = [
  {
    title: "Create your account and brief",
    tag: "Four questions",
    body: "Tell us what keeps landing on your plate and how many hours it takes. We work out the role from your answers, so you don't have to know what to call it.",
  },
  {
    title: "Open the bench",
    tag: `${usd(ACCESS_FEE)} per role, credited`,
    body: `See every vetted profile for that role, with experience and certifications up front. The ${usd(ACCESS_FEE)} is credited toward your placement fee if you hire.`,
  },
  {
    title: "Shortlist and interview",
    tag: `Within ${INTERVIEW_CONFIRM_BUSINESS_DAYS} business days`,
    body: `Pick up to ${MAX_SHORTLIST} people to meet. Our placements team confirms each interview request within ${INTERVIEW_CONFIRM_BUSINESS_DAYS} business days.`,
  },
  {
    title: "Hire with a guarantee",
    tag: `${REPLACEMENT_DAYS}-day replacement`,
    body: `Pay a one-time placement fee and sign online. If your VA isn't the right fit within ${REPLACEMENT_DAYS} days of their first day, we find a replacement at no extra placement fee.`,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How it works</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From your first question to your first interview, without sourcing or screening a
            single résumé yourself.
          </p>
        </div>
        <ol className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <li key={step.title} className="flex flex-col rounded-2xl border border-border bg-white p-6">
              <span className="flex size-9 items-center justify-center rounded-full bg-accent text-sm font-bold text-brand-ink">
                {index + 1}
              </span>
              <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              <p className="mt-auto pt-5 text-sm font-semibold text-brand-ink">{step.tag}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
