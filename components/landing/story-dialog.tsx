"use client";

import dynamic from "next/dynamic";
import { XIcon } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { Story } from "@/lib/stories";

// The player (Mux Player, through next-video) is loaded only when someone presses play, so
// the page carries stills and short previews until then.
const Video = dynamic(() => import("next-video"), { ssr: false });

/** The full clip, with sound, in a dialog. */
export function StoryDialog({ story, open, onOpenChange }: { story: Story | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="overflow-hidden overscroll-contain bg-black p-0 ring-0 sm:max-w-4xl">
        {/* The stock close button is a dark icon, which vanishes against dark footage. */}
        <DialogClose
          aria-label="Close video"
          className="absolute top-3 right-3 z-10 flex size-9 items-center justify-center rounded-full bg-black/70 text-white transition-colors hover:bg-black/90 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
        >
          <XIcon className="size-5" aria-hidden />
        </DialogClose>
        {story && (
          <>
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
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
