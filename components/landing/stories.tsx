import { STORIES } from "@/lib/stories";
import { Coverflow } from "./coverflow";

export function Stories() {
  return (
    <section className="band-sec tint" aria-labelledby="stories-title">
      <div className="wrap" style={{ display: "grid", gap: 40 }}>
        <div className="sec-head">
          <p className="eyebrow">Client stories</p>
          <h2 className="h2" id="stories-title">
            Hear it from the owners.
          </h2>
          <p className="sub">
            Proof, not promises. Business owners who hired through Scale Virtually, on camera and in their own words, on what changed once
            their VA started.
          </p>
        </div>
        <Coverflow stories={STORIES} />
      </div>
    </section>
  );
}
