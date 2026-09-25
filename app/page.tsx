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
      <SiteHeader />
      <main className="flex-1">
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
