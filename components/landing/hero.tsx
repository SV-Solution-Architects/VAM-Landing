import { CalendarCheckIcon, HandCoinsIcon, ShieldCheckIcon } from "lucide-react";
import { HERO_STORY, STORIES } from "@/lib/stories";
import { INTERVIEW_CONFIRM_BUSINESS_DAYS, REPLACEMENT_DAYS } from "@/lib/terms";
import { StartBriefLink } from "./cta";
import { StoryVideo } from "./story-video";

const PROOF = [
  { icon: CalendarCheckIcon, label: `Interviews within ${INTERVIEW_CONFIRM_BUSINESS_DAYS} business days` },
  { icon: ShieldCheckIcon, label: `${REPLACEMENT_DAYS}-day replacement guarantee` },
  { icon: HandCoinsIcon, label: "No margin on your VA's pay" },
];

export function Hero() {
  return (
    <section id="top" className="bg-cream">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 pt-14 pb-16 sm:px-6 md:pt-20 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16 lg:pb-24">
        <div>
          <p className="text-sm font-semibold tracking-wide text-brand-ink uppercase">
            VA Marketplace by Scale Virtually
          </p>
          <h1 className="mt-4 text-4xl leading-[1.08] font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-[3.5rem]">
            {/* Two lines, no full stops: at this weight the font sets a period well
                clear of the word before it, which reads as a stray space. */}
            <span className="block">Vetted virtual assistants</span>
            <span className="block text-brand-ink">
              Interview within {INTERVIEW_CONFIRM_BUSINESS_DAYS} business days
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Tell us what keeps landing on your plate and browse the bench the same day. Every
            VA is vetted before listing. Shortlist up to three, and our placements team books
            the interviews.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <StartBriefLink />
            <a
              href="#stories"
              className="inline-flex h-12 items-center rounded-xl border border-border bg-white px-6 text-base font-semibold text-foreground transition-colors hover:bg-secondary focus-visible:ring-4 focus-visible:ring-brand/40 focus-visible:outline-none"
            >
              Watch client stories
            </a>
          </div>
          <ul className="mt-9 grid gap-3 text-sm font-medium text-charcoal sm:grid-cols-3">
            {PROOF.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2">
                <Icon className="size-5 shrink-0 text-brand-ink" aria-hidden />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <figure>
          <StoryVideo
            story={HERO_STORY}
            width={560}
            sizes="(min-width: 1024px) 560px, 100vw"
            priority
            className="shadow-xl ring-1 ring-black/5"
          />
          <figcaption className="mt-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-border">
            <blockquote className="text-base leading-relaxed text-foreground">
              &ldquo;{HERO_STORY.quote}&rdquo;
            </blockquote>
            <p className="mt-3 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{HERO_STORY.name}</span>,{" "}
              {HERO_STORY.role}, {HERO_STORY.company}
            </p>
          </figcaption>
        </figure>
      </div>

      <div className="border-t border-border/70">
        <p className="mx-auto max-w-6xl px-4 py-6 text-center text-sm leading-relaxed text-muted-foreground sm:px-6">
          <span className="font-semibold text-charcoal">Scale Virtually clients include</span>{" "}
          {STORIES.map((story) => story.company).join(" · ")}
        </p>
      </div>
    </section>
  );
}
