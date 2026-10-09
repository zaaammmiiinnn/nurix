import dynamic from "next/dynamic";
import { HeroSection } from "@/components/sections/hero";
import { TrustStrip } from "@/components/sections/trust-strip";
import { LocalBusinessJsonLd, FaqJsonLd } from "@/components/seo/json-ld";
import { FAQS_DATA } from "@/lib/data/site-data";

// Dynamically import below-the-fold sections for optimized initial hydration & TBT
const ServicesSection = dynamic(
  () => import("@/components/sections/services").then((mod) => mod.ServicesSection),
  { ssr: true }
);

const HowItWorks = dynamic(
  () => import("@/components/sections/how-it-works").then((mod) => mod.HowItWorks),
  { ssr: true }
);

const FeaturedWork = dynamic(
  () => import("@/components/sections/featured-work").then((mod) => mod.FeaturedWork),
  { ssr: true }
);

const PricingTeaser = dynamic(
  () => import("@/components/sections/pricing-teaser").then((mod) => mod.PricingTeaser),
  { ssr: true }
);

const WhyNeuralWaves = dynamic(
  () => import("@/components/sections/why-neuralwaves").then((mod) => mod.WhyNeuralWaves),
  { ssr: true }
);

const FaqSection = dynamic(
  () => import("@/components/sections/faq").then((mod) => mod.FaqSection),
  { ssr: true }
);

const FinalCta = dynamic(
  () => import("@/components/sections/final-cta").then((mod) => mod.FinalCta),
  { ssr: true }
);

export default function HomePage() {
  return (
    <>
      {/* Structured SEO Data for Google Rich Results */}
      <LocalBusinessJsonLd />
      <FaqJsonLd faqs={FAQS_DATA} />

      {/* Hero & Social Proof - Above the Fold */}
      <HeroSection />
      <TrustStrip />

      {/* Below the Fold Components */}
      <ServicesSection />
      <HowItWorks />
      <FeaturedWork />
      <PricingTeaser />
      <WhyNeuralWaves />
      <FaqSection />
      <FinalCta />
    </>
  );
}
