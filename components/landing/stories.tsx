import { HERO_STORY, STORIES, type Story } from "@/lib/stories";
import { StoryVideo } from "./story-video";

// Jesse's story leads because it has the arc that persuades best: a stated doubt (time
// zones), then the reason it went away. The hero already carries Aaron's.
const FEATURED_ID = "jesse-hallstrom";

function Attribution({ story }: { story: Story }) {
  return (
    <p className="text-sm text-muted-foreground">
      <span className="font-semibold text-foreground">{story.name}</span>
      <br />
      {story.role}, {story.company}
    </p>
  );
}

export function Stories() {
  const featured = STORIES.find((story) => story.id === FEATURED_ID)!;
  const rest = STORIES.filter((story) => story.id !== FEATURED_ID && story.id !== HERO_STORY.id);

  return (
    <section id="stories" className="bg-cream py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">What Scale Virtually clients say</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Business owners in their own words, filmed before VA Marketplace launched. Every
            quote is from the video on its card.
          </p>
        </div>

        <article className="mt-12 grid gap-8 rounded-3xl bg-white p-5 ring-1 ring-border sm:p-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <StoryVideo story={featured} width={640} sizes="(min-width: 1024px) 620px, 100vw" />
          <div>
            <p className="text-sm font-semibold tracking-wide text-brand-ink uppercase">{featured.theme}</p>
            <blockquote className="mt-3 text-2xl leading-snug font-semibold tracking-tight">
              &ldquo;{featured.quote}&rdquo;
            </blockquote>
            <div className="mt-5">
              <Attribution story={featured} />
            </div>
          </div>
        </article>

        <ul className="mt-6 grid gap-6 sm:grid-cols-2">
          {rest.map((story) => (
            <li key={story.id} className="flex flex-col rounded-3xl bg-white p-5 ring-1 ring-border">
              <StoryVideo story={story} width={520} sizes="(min-width: 640px) 520px, 100vw" />
              <p className="mt-5 text-sm font-semibold tracking-wide text-brand-ink uppercase">{story.theme}</p>
              <blockquote className="mt-2 text-lg leading-snug font-medium">&ldquo;{story.quote}&rdquo;</blockquote>
              <div className="mt-auto pt-5">
                <Attribution story={story} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
