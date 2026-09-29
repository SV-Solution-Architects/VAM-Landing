"use client";

import { useEffect, useRef } from "react";
import { mountSphere } from "@/lib/net";

/**
 * The hero section with the neural sphere behind it. The canvas fills the section; the
 * section itself is the drag zone, so a drag anywhere that is not a button or link spins
 * the globe, and a click on open ground adds a node.
 */
export function HeroSphere({ children }: { children: React.ReactNode }) {
  const section = useRef<HTMLElement>(null);
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!section.current || !host.current) return;
    return mountSphere(host.current, section.current, { max: 130, r: 0.62, linkDist: 0.34, cy: 0.5, la: 0.2, na: 0.6, sa: 0.42 });
  }, []);
  return (
    <section className="hero" id="top" aria-labelledby="hero-title" ref={section}>
      <div className="net" aria-hidden="true" ref={host}>
        <canvas />
      </div>
      {children}
    </section>
  );
}
