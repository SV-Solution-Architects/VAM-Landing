"use client";

import { useEffect, useRef, useState } from "react";
import { START_BRIEF_URL } from "@/lib/site";
import { mountTilt } from "@/lib/net";
import { reduceMotion } from "@/lib/theme";
import { ThemeToggle } from "./theme-toggle";

// No top bar: the mark alone top-left, a plus under it that opens the rail menu, and the
// theme toggle top-right. The rail hangs in the page's left gutter, which stays wide enough
// for it at tablet widths and up (see the --gutter rule in landing.css).
const ITEMS = [
  { href: "#benefits", label: "Benefits" },
  { href: "#stories", label: "Stories" },
  { href: "#how", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

/** Vertical centre of a menu item's node, relative to the menu. */
function nodeY(menu: HTMLElement, li: Element) {
  const mr = menu.getBoundingClientRect();
  const d = li.querySelector("i")!.getBoundingClientRect();
  return d.top + d.height / 2 - mr.top;
}
/** The rail runs from the first node to the last. */
function sizeRail(menu: HTMLElement, rail: HTMLElement) {
  const items = menu.querySelectorAll("li");
  rail.style.setProperty("--rail-h", `${nodeY(menu, items[items.length - 1]).toFixed(1)}px`);
}
/** The orange fill climbs to the hovered or focused item. */
function fillTo(menu: HTMLElement, rail: HTMLElement, li: Element | null) {
  rail.style.setProperty("--fill", li ? `${nodeY(menu, li).toFixed(1)}px` : "0px");
}

export function CornerControls() {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);
  const markRef = useRef<HTMLAnchorElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLSpanElement>(null);
  const topRef = useRef<HTMLElement>(null);
  const timer = useRef(0);

  // The mark tilts toward the pointer, like the one in the closing band.
  useEffect(() => {
    const el = markRef.current;
    return el ? mountTilt(el, el, 26, 22) : undefined;
  }, []);

  // A little blur behind the mark once it floats over content.
  useEffect(() => {
    const top = topRef.current;
    if (!top) return;
    const onScroll = () => top.classList.toggle("scrolled", window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Open: show, measure, then add the class so the rail draws and the labels fade in.
  // Close: fade out, then hide.
  useEffect(() => {
    const menu = menuRef.current;
    const rail = railRef.current;
    if (!menu || !rail) return;
    window.clearTimeout(timer.current);
    if (open) {
      fillTo(menu, rail, null);
      requestAnimationFrame(() => {
        sizeRail(menu, rail);
        requestAnimationFrame(() => menu.classList.add("open"));
      });
    } else {
      menu.classList.remove("open");
      timer.current = window.setTimeout(() => setShown(false), reduceMotion() ? 0 : 500);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!menuRef.current?.contains(t) && !btnRef.current?.contains(t)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    const onResize = () => {
      if (menuRef.current && railRef.current) sizeRail(menuRef.current, railRef.current);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  function toggle() {
    if (!open) setShown(true);
    setOpen(!open);
  }
  const hover = (e: React.SyntheticEvent<HTMLAnchorElement>) => {
    if (menuRef.current && railRef.current) fillTo(menuRef.current, railRef.current, e.currentTarget.parentElement);
  };
  const leave = () => {
    if (menuRef.current && railRef.current) fillTo(menuRef.current, railRef.current, null);
  };

  function go(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    if (href.startsWith("#")) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: reduceMotion() ? "auto" : "smooth", block: "start" });
      }
    }
    setOpen(false);
  }

  return (
    <>
      <header className="top" id="top-bar" ref={topRef}>
        <div className="top-left">
          <a className="brand-mark" href="#top" ref={markRef} aria-label="VA Marketplace by Scale Virtually, back to top">
            <span className="tilt">
              <svg className="mark" viewBox="0 0 494 506" aria-hidden="true">
                <use href="#svmark" />
              </svg>
            </span>
          </a>
          <button
            type="button"
            className={`menu-plus${open ? " is-open" : ""}`}
            ref={btnRef}
            aria-expanded={open}
            aria-controls="menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={toggle}
          >
            <svg viewBox="0 0 14 14" aria-hidden="true">
              <path d="M7 1.5v11M1.5 7h11" />
            </svg>
          </button>
        </div>
        <div className="top-actions">
          <ThemeToggle />
        </div>
      </header>
      <nav className="cmenu" id="menu" aria-label="Page sections" ref={menuRef} hidden={!shown}>
        <span className="mrail" aria-hidden="true" ref={railRef}>
          <i className="mrail-fill" />
        </span>
        <ul className="cmenu-list" onMouseLeave={leave}>
          {ITEMS.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onMouseEnter={hover}
                onFocus={hover}
                onClick={(e) => go(e, item.href)}
              >
                <i />
                {item.label}
              </a>
            </li>
          ))}
          <li className="cta">
            <a
              href={START_BRIEF_URL}
              onMouseEnter={hover}
              onFocus={hover}
              onClick={() => setOpen(false)}
            >
              <i />
              Start
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
}
