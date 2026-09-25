/**
 * Where the page sends people: the VA Marketplace app.
 *
 * Every call to action goes to `/brief`, the app's "start a hiring brief" route, which
 * sends a new visitor to sign up and then mints a brief of their own. A link to
 * `/brief/<id>` would put every visitor on the same brief.
 *
 * Set NEXT_PUBLIC_APP_URL when the app moves to its own domain.
 */
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://va-marketplace-mvp-zxjq.vercel.app";

export const START_BRIEF_URL = `${APP_URL}/brief`;
export const TERMS_URL = `${APP_URL}/terms`;
