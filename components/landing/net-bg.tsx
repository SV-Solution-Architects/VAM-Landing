"use client";

import { useEffect, useRef } from "react";
import { mountDrift, type DriftOptions } from "@/lib/net";

const PRESETS: Record<string, DriftOptions> = {
  stage: { density: 18000, max: 44, min: 16, speed: 0.012, linkDist: 140, la: 0.2, na: 0.55, sa: 0.4 },
  cf: { density: 24000, max: 56, min: 18, speed: 0.012, linkDist: 150 },
};

/** A quiet drifting lattice behind an object. The parent is the pointer zone. */
export function NetBg({ preset, className = "" }: { preset: keyof typeof PRESETS; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    return mountDrift(ref.current, PRESETS[preset]);
  }, [preset]);
  return (
    <div className={`netbg ${className}`} aria-hidden="true" ref={ref}>
      <canvas />
    </div>
  );
}
