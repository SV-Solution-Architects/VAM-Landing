"use client";

import Image from "next/image";
import { useState } from "react";
import { posterUrl, type Story } from "@/lib/stories";
import { StoryDialog } from "./story-dialog";

/** A small round still that plays the story's clip when pressed. */
export function StoryThumb({ story, position = "42% 45%" }: { story: Story; position?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="attrib-thumb" type="button" aria-label={`Play ${story.name}'s clip, ${story.duration}`} onClick={() => setOpen(true)}>
        <Image src={posterUrl(story, 160)} alt="" width={56} height={56} unoptimized style={{ objectPosition: position }} />
        <span className="pmini">
          <svg viewBox="0 0 12 12" aria-hidden="true">
            <use href="#i-play" />
          </svg>
        </span>
      </button>
      <StoryDialog story={story} open={open} onOpenChange={setOpen} />
    </>
  );
}
