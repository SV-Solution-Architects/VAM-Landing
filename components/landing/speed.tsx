import { INTERVIEW_CONFIRM_BUSINESS_DAYS } from "@/lib/terms";

// Three separate facts, deliberately not drawn as bars on one scale: 39 days is the time
// to fill a role, and the marketplace figures are time to browse and to interview. Bars
// side by side would compare milestones that are not the same thing.
const FACTS = [
  {
    figure: "39 days",
    label: "Median time to fill a non-executive role in the U.S.",
    source: "SHRM Recruiting Benchmarking, 2026 (4,600+ organizations)",
    muted: true,
  },
  {
    figure: "Same day",
    label: "Browse the VA bench for your role, once you've signed up and opened it.",
    muted: false,
  },
  {
    figure: `${INTERVIEW_CONFIRM_BUSINESS_DAYS} business days`,
    label: "For our placements team to confirm each interview you request.",
    muted: false,
  },
];

export function Speed() {
  return (
    <section id="speed" className="py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Faster than hiring the usual way</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            The usual way is weeks of job posts, résumés and screening calls. Here the
            screening is done before you arrive.
          </p>
        </div>
        <dl className="mt-12 grid gap-5 md:grid-cols-3">
          {FACTS.map((fact) => (
            <div
              key={fact.figure}
              className={
                fact.muted
                  ? "rounded-2xl border border-dashed border-border p-6"
                  : "rounded-2xl border border-brand/30 bg-accent p-6"
              }
            >
              <dt className="sr-only">{fact.label}</dt>
              <dd>
                <p className={`text-4xl font-extrabold tracking-tight ${fact.muted ? "text-muted-foreground" : "text-brand-ink"}`}>
                  {fact.figure}
                </p>
                <p className="mt-3 text-base leading-relaxed text-foreground">{fact.label}</p>
                {fact.source && <p className="mt-3 text-xs text-muted-foreground">Source: {fact.source}</p>}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
