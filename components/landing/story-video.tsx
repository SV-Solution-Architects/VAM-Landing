"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
import { PlayIcon, XIcon } from "lucide-react";
import { cn } from "cn";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { posterUrl, type Story } from "@/lib/stories";

// The player (Mux Player, through next-video) is loaded only when someone presses play.
// Until then the card is a still image, so six videos cost the page six small images.
const Video = dynamic(() => import("next-video"), { ssr: false });

type Props = {
  story: Story;
  /** Width, in CSS pixels, the still is drawn at on a wide screen. */
  width: number;
  sizes: string;
  priority?: boolean;
  className?: string;
};

export function StoryVideo({ story, width, sizes, priority, className }: Props) {
  const [open, setOpen] = useState(false);
  const label = `Play ${story.name}'s video, ${story.duration}`;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={label}
        className={cn(
          "group relative block aspect-video w-full overflow-hidden rounded-2xl bg-charcoal outline-none",
          "focus-visible:ring-4 focus-visible:ring-brand/60",
          className
        )}
      >
        <Image
          src={posterUrl(story, width * 2)}
          alt=""
          fill
          sizes={sizes}
          priority={priority}
          unoptimized
          placeholder="blur"
          blurDataURL={story.video.blurDataURL}
          // Several recordings are letterboxed inside their frame. A slight zoom pushes
          // the black bars out of the card.
          className="scale-[1.2] object-cover transition-transform duration-300 group-hover:scale-[1.23] motion-reduce:transition-none"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-black/0" />
        <span className="absolute top-1/2 left-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand text-primary-foreground shadow-lg transition-transform duration-200 group-hover:scale-105 motion-reduce:transition-none">
          <PlayIcon className="size-7 translate-x-0.5 fill-current" aria-hidden />
        </span>
        <span className="absolute right-3 bottom-3 rounded-md bg-black/70 px-2 py-0.5 text-xs font-medium text-white tabular-nums">
          {story.duration}
        </span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent showCloseButton={false} className="overflow-hidden bg-black p-0 ring-0 sm:max-w-4xl">
          {/* The stock close button is a dark icon, which vanishes against dark footage. */}
          <DialogClose
            aria-label="Close video"
            className="absolute top-3 right-3 z-10 flex size-9 items-center justify-center rounded-full bg-black/70 text-white transition-colors hover:bg-black/90 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
          >
            <XIcon className="size-5" aria-hidden />
          </DialogClose>
          <DialogTitle className="sr-only">
            {story.name}, {story.role}, {story.company}
          </DialogTitle>
          {open && (
            <Video
              src={story.video}
              autoPlay
              className="aspect-video w-full"
              // The default (Sutro) theme is coloured by CSS variables, not props.
              style={{ "--media-accent-color": "#f07d22" }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
