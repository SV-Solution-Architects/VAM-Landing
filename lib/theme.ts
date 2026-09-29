/**
 * The theme is a `data-theme` attribute on <html>: "light" or "dark". app/layout.tsx sets it
 * before first paint from localStorage or the OS preference; the toggle changes it and
 * tells the canvases, which read their colours from CSS variables, to repaint.
 */
export const THEME_KEY = "vam-theme";
export const THEME_EVENT = "vam:theme";

export type Theme = "light" | "dark";

export function currentTheme(): Theme {
  const set = document.documentElement.getAttribute("data-theme");
  if (set === "light" || set === "dark") return set;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyTheme(theme: Theme, persist = true) {
  document.documentElement.setAttribute("data-theme", theme);
  if (persist) {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // Private mode or blocked storage: the choice still applies for this page view.
    }
  }
  window.dispatchEvent(new Event(THEME_EVENT));
}

export function storedTheme(): Theme | null {
  try {
    const t = localStorage.getItem(THEME_KEY);
    return t === "light" || t === "dark" ? t : null;
  } catch {
    return null;
  }
}

export function onThemeChange(fn: () => void): () => void {
  window.addEventListener(THEME_EVENT, fn);
  return () => window.removeEventListener(THEME_EVENT, fn);
}

export const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export const finePointer = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;
export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
