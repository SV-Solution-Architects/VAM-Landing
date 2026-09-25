import Image from "next/image";
import { START_BRIEF_URL, TERMS_URL } from "@/lib/site";
import { INTERVIEW_CONFIRM_BUSINESS_DAYS } from "@/lib/terms";
import { StartBriefLink } from "./cta";

/** Scale Virtually's line, as Aja gave it on 25 Sep 2026. */
const TAGLINE = ["Scale Higher,", "Scale Faster,", "Scale Virtually."];

export function FinalCta() {
  return (
    <section className="bg-charcoal py-20 text-white md:py-28">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <h2 className="text-4xl leading-tight font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          {TAGLINE[0]} {TAGLINE[1]} <span className="text-brand">{TAGLINE[2]}</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-white/80">
          Start your hiring brief now and be interviewing vetted VAs within{" "}
          {INTERVIEW_CONFIRM_BUSINESS_DAYS} business days of requesting them.
        </p>
        <div className="mt-9 flex justify-center">
          <StartBriefLink />
        </div>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-[#2b2c2b] text-white/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 text-sm sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Image src="/brand/sv-logo-horizontal-white.svg" alt="Scale Virtually" width={134} height={30} className="h-7 w-auto" />
          <span className="hidden text-white/50 sm:inline">{TAGLINE.join(" ")}</span>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
          <a href={START_BRIEF_URL} className="hover:text-white">Start a hiring brief</a>
          <a href={TERMS_URL} className="hover:text-white">Marketplace terms</a>
        </nav>
        <p>© {new Date().getFullYear()} Scale Virtually</p>
      </div>
    </footer>
  );
}
