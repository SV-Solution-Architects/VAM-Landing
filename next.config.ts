import type { NextConfig } from "next";
import { withNextVideo } from "next-video/process";

const nextConfig: NextConfig = {
  /* config options here */
};

// Testimonial videos in /videos are uploaded to Mux by `npx next-video sync`, which
// leaves a small .json per video (committed) pointing at the Mux asset. `basic` quality
// is free to encode on Mux and plenty for talking-head testimonials.
export default withNextVideo(nextConfig, {
  provider: "mux",
  // next-video 2.8.1's type for this object requires `generateAssetKey`, typed as
  // `undefined` for Mux, so it has to be spelled out to type-check.
  providerConfig: { mux: { videoQuality: "basic", generateAssetKey: undefined } },
});
