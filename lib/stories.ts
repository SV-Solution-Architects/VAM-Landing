import type { Asset } from "next-video/dist/assets.js";
import aaronJson from "@/videos/aaron-bogie.mp4.json";
import brianJson from "@/videos/brian-lignelli.wmv.json";
import jesseJson from "@/videos/jesse-hallstrom.wmv.json";
import marcJson from "@/videos/marc-posselt.mp4.json";
import stacyJson from "@/videos/stacy-corrigan.wmv.json";
import wesJson from "@/videos/wes-koontz.mp4.json";

type MuxAsset = Asset & {
  providerMetadata: { mux: { assetId: string; playbackId: string } };
  blurDataURL: string;
};

/**
 * A synced video's record, checked. JSON imports type `status` as any string, and a
 * record still "uploading" or "processing" has no playback id, so refuse it here and the
 * build fails instead of shipping a card that cannot play.
 */
function readyAsset(json: unknown): MuxAsset {
  const asset = json as MuxAsset;
  if (asset.status !== "ready" || !asset.providerMetadata?.mux?.playbackId) {
    throw new Error(`Video is not ready on Mux yet: ${asset.originalFilePath} (${asset.status})`);
  }
  return asset;
}

const aaron = readyAsset(aaronJson);
const brian = readyAsset(brianJson);
const jesse = readyAsset(jesseJson);
const marc = readyAsset(marcJson);
const stacy = readyAsset(stacyJson);
const wes = readyAsset(wesJson);

/**
 * Client stories: Scale Virtually clients, filmed 2022 to 2025 about Scale Virtually's
 * managed service, before the marketplace existed. The page says so.
 *
 * Every quote is verbatim from the video beside it (Mux's auto-captions, checked against
 * the clip at `quoteAt`) and was approved by Aja on 25 Sep 2026. Names, roles and
 * companies are as Aja gave them, not as the captions spelled them. Lines about Scale
 * Virtually's process engineering and SOP manuals were left out on purpose, because the
 * marketplace may not include that work, and Wes Koontz's "up and running in a couple of
 * weeks" was left out because it would contradict the page's speed claim.
 *
 * Jesse Hallstrom's clip shows two people. Nothing here says which one is Jesse, and the
 * card shows the full frame rather than a face crop.
 */

export type Story = {
  id: string;
  name: string;
  role: string;
  company: string;
  /** Short heading over the quote: what the quote is evidence of. */
  theme: string;
  quote: string;
  /** Where the quote is in the clip, as "M:SS". */
  quoteAt: string;
  /** Clip length, as "M:SS". */
  duration: string;
  video: MuxAsset;
};

export const STORIES: Story[] = [
  {
    id: "jesse-hallstrom",
    name: "Jesse Hallstrom",
    role: "President & CFO",
    company: "Hempel Real Estate",
    theme: "Worried about time zones",
    quote:
      "A fear that I had was… they're over there, we're over here at different time zones… [Now] I feel like they're an employee who lives around the block.",
    quoteAt: "1:00",
    duration: "3:56",
    video: jesse,
  },
  {
    id: "aaron-bogie",
    name: "Aaron Bogie",
    role: "Principal Owner",
    company: "The Property Center & LBV Insurance",
    theme: "Results within days",
    quote:
      "I had 5,400 unopened emails… literally within a matter of days, she had me on track and on task.",
    quoteAt: "1:32",
    duration: "1:59",
    video: aaron,
  },
  {
    id: "marc-posselt",
    name: "Marc Posselt",
    role: "Licensed Realtor",
    company: "Posselt Real Estate – Powered by eXp",
    theme: "The interviews",
    quote:
      "We started off with three VAs that I was going to interview… I would have hired any three of them actually.",
    quoteAt: "0:20",
    duration: "2:52",
    video: marc,
  },
  {
    id: "stacy-corrigan",
    name: "Stacy Corrigan",
    role: "Broker/President",
    company: "Peace of Mind Property Management & Real Estate, Inc.",
    theme: "Immediate impact",
    quote:
      "[They] have immediately transformed my business and I'm actually having to put on my running shoes to keep up with them.",
    quoteAt: "0:27",
    duration: "2:08",
    video: stacy,
  },
  {
    id: "wes-koontz",
    name: "Wesley C. Koontz, CCIM",
    role: "Managing Partner",
    company: "Foresite Capital Partners",
    theme: "Cost against hiring in-house",
    quote: "…at a lower cost than we had done previously with in-house employees.",
    quoteAt: "0:20",
    duration: "4:18",
    video: wes,
  },
  {
    id: "brian-lignelli",
    name: "Brian Lignelli",
    role: "Founder",
    company: "Continuum Capital Funding",
    theme: "Growing faster",
    quote:
      "We're going to be able to evolve at a much quicker rate than what I had anticipated.",
    quoteAt: "0:21",
    duration: "1:03",
    video: brian,
  },
];

/** The story that leads the hero: a single speaker, and a concrete result. */
export const HERO_STORY = STORIES.find((story) => story.id === "aaron-bogie")!;

/**
 * A still from the clip, served by Mux at the width asked for. Eight seconds in, every
 * speaker is on camera and past any title card.
 */
export function posterUrl(story: Story, width: number) {
  const playbackId = story.video.providerMetadata.mux.playbackId;
  return `https://image.mux.com/${playbackId}/thumbnail.webp?time=8&width=${width}`;
}
