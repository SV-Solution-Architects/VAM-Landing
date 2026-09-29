"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useEffect } from "react";
import { applyTheme, currentTheme, storedTheme } from "@/lib/theme";

/**
 * Light or dark, one tap. The icons are chosen by CSS from the attribute on <html>, which
 * the layout's inline script sets before paint, so there is nothing to render on the client
 * and no mismatch to hide. With no stored choice the page follows the OS if it changes.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const follow = () => {
      if (!storedTheme()) applyTheme(mq.matches ? "dark" : "light", false);
    };
    mq.addEventListener("change", follow);
    return () => mq.removeEventListener("change", follow);
  }, []);

  return (
    <button
      type="button"
      className={`theme-toggle ${className}`}
      aria-label="Switch between light and dark"
      onClick={() => applyTheme(currentTheme() === "dark" ? "light" : "dark")}
    >
      <MoonIcon className="i-moon" aria-hidden />
      <SunIcon className="i-sun" aria-hidden />
      <span className="tt-label">Theme</span>
    </button>
  );
}
