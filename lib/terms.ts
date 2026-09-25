/**
 * The marketplace's commercial terms, as the page states them.
 *
 * COPIED, NOT INVENTED. Every figure is the constant of the same name in the VA
 * Marketplace app (SV-Solution-Architects/va-marketplace-mvp, app/journey/model.ts and
 * app/journey/terms.ts, as of 25 Sep 2026), which is what a client accepts before paying.
 * If the app's terms change, change these with them: a landing page that quotes a
 * different fee or guarantee than the agreement is making a promise nobody signed.
 */

/** Opens every vetted profile for one role; credited against the placement fee. */
export const ACCESS_FEE = 1000;

/** One-time placement fee, by tier. The access payment is credited against it. */
export const PLACEMENT_FEE = {
  Standard: 3000,
  Executive: 4000,
  Specialist: 5000,
} as const;

/** Days from the VA's first working day within which a replacement costs no new fee. */
export const REPLACEMENT_DAYS = 90;

/** Placements confirm each interview request within this many business days. */
export const INTERVIEW_CONFIRM_BUSINESS_DAYS = 2;

/** Candidates a client can shortlist at a time. */
export const MAX_SHORTLIST = 3;

/** Requested interviews one access payment covers. */
export const INTERVIEW_CAP = 15;

export const usd = (amount: number) => `$${amount.toLocaleString("en-US")}`;
