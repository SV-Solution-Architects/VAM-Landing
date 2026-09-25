import { Faq } from "@/components/landing/faq";
import { FinalCta, SiteFooter } from "@/components/landing/final-cta";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Pricing } from "@/components/landing/pricing";
import { SiteHeader } from "@/components/landing/site-header";
import { Speed } from "@/components/landing/speed";
import { Stories } from "@/components/landing/stories";

// The section order the research settled on: promise and proof first, then how it works,
// then the stories, the speed facts, the price and guarantee, the questions, and one last
// call to action.
export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 rounded-lg bg-charcoal px-4 py-2 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to main content
      </a>
      <SiteHeader />
      <main id="main" className="flex-1">
        <Hero />
        <HowItWorks />
        <Stories />
        <Speed />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}
