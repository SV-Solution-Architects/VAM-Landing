import { Benefits } from "@/components/landing/benefits";
import { BrandSymbols } from "@/components/landing/brand-symbols";
import { Closing } from "@/components/landing/closing";
import { CornerControls } from "@/components/landing/corner-controls";
import { Faq } from "@/components/landing/faq";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Marquee } from "@/components/landing/marquee";
import { Pricing } from "@/components/landing/pricing";
import { SiteFooter } from "@/components/landing/site-footer";
import { Stories } from "@/components/landing/stories";

// The Relay order: the promise, who has hired, what you get, the client stories, how it
// works, the price, the questions, and the slogan with one last call to action.
export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-[70] rounded-lg bg-charcoal px-4 py-2 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to main content
      </a>
      <BrandSymbols />
      <CornerControls />
      <main id="main" className="flex-1">
        <Hero />
        <Marquee />
        <Benefits />
        <Stories />
        <HowItWorks />
        <Pricing />
        <Faq />
        <Closing />
      </main>
      <SiteFooter />
    </>
  );
}
