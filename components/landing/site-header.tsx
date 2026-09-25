import Image from "next/image";
import { StartBriefLink } from "./cta";

const NAV = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#stories", label: "Client stories" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
        <a href="#top" className="flex shrink-0 items-center gap-3" aria-label="VA Marketplace by Scale Virtually, back to top">
          <Image
            src="/brand/sv-logo-horizontal-color.svg"
            alt=""
            width={134}
            height={32}
            priority
            className="h-8 w-auto"
          />
          <span className="hidden border-l border-border pl-3 text-sm font-semibold text-charcoal sm:inline">
            VA Marketplace
          </span>
        </a>
        <nav aria-label="Sections" className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="transition-colors hover:text-foreground">
              {item.label}
            </a>
          ))}
        </nav>
        <StartBriefLink size="sm">Start your brief</StartBriefLink>
      </div>
    </header>
  );
}
