import { ShieldCheckIcon } from "lucide-react";
import { TERMS_URL } from "@/lib/site";
import { ACCESS_FEE, INTERVIEW_CAP, PLACEMENT_FEE, REPLACEMENT_DAYS, usd } from "@/lib/terms";

export function Pricing() {
  const standardAtCheckout = PLACEMENT_FEE.Standard - ACCESS_FEE;

  return (
    <section id="pricing" className="bg-cream py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">What it costs</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Two payments to Scale Virtually, both shown up front. Your VA&apos;s pay goes to
            them directly.
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          <article className="flex flex-col rounded-2xl bg-white p-7 ring-1 ring-border">
            <h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Marketplace access</h3>
            <p className="mt-4">
              <span className="text-4xl font-extrabold tracking-tight">{usd(ACCESS_FEE)}</span>
              <span className="ml-2 text-muted-foreground">per role</span>
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Opens every vetted profile for the role and up to {INTERVIEW_CAP} interview
              requests. Credited toward your placement fee if you hire.
            </p>
          </article>

          <article className="flex flex-col rounded-2xl bg-white p-7 ring-1 ring-border">
            <h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Placement fee</h3>
            <p className="mt-4">
              <span className="text-muted-foreground">from </span>
              <span className="text-4xl font-extrabold tracking-tight">{usd(PLACEMENT_FEE.Standard)}</span>
              <span className="ml-2 text-muted-foreground">one-time</span>
            </p>
            <dl className="mt-4 divide-y divide-border text-sm">
              {Object.entries(PLACEMENT_FEE).map(([tier, fee]) => (
                <div key={tier} className="flex justify-between py-2">
                  <dt className="text-muted-foreground">{tier}</dt>
                  <dd className="font-semibold tabular-nums">{usd(fee)}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Your {usd(ACCESS_FEE)} is credited, so a Standard hire is {usd(standardAtCheckout)} at checkout.
            </p>
          </article>

          <article className="flex flex-col rounded-2xl bg-white p-7 ring-1 ring-border">
            <h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Your VA&apos;s pay</h3>
            <p className="mt-4 text-2xl font-extrabold tracking-tight">Paid directly to your VA</p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Set in your placement agreement and paid to your VA, not to us. No margin added by
              Scale Virtually.
            </p>
          </article>
        </div>

        <div className="mt-6 flex flex-col gap-4 rounded-2xl bg-charcoal p-7 text-white sm:flex-row sm:items-center sm:gap-6">
          <ShieldCheckIcon className="size-10 shrink-0 text-brand" aria-hidden />
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{REPLACEMENT_DAYS}-day replacement guarantee</h3>
            <p className="mt-1 text-sm leading-relaxed text-white/80">
              If your VA isn&apos;t the right fit within {REPLACEMENT_DAYS} days of their first working
              day, we find you a replacement at no extra placement fee.
            </p>
          </div>
          <a
            href={TERMS_URL}
            // White, not orange: small orange text on charcoal is 4.1:1, under the 4.5:1
            // WCAG AA asks of body-size text.
            className="text-sm font-semibold text-white underline decoration-brand decoration-2 underline-offset-4 hover:decoration-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Read the marketplace terms
          </a>
        </div>
      </div>
    </section>
  );
}
