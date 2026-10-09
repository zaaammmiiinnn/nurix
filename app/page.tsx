import dynamic from "next/dynamic";
import { HeroSection } from "@/components/sections/hero";
import { TrustStrip } from "@/components/sections/trust-strip";
import { FeaturedWork } from "@/components/sections/featured-work";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { LocalBusinessJsonLd, FaqJsonLd } from "@/components/seo/json-ld";

// Dynamically import below-the-fold sections for optimized initial hydration & TBT
const ServicesSection = dynamic(
  () => import("@/components/sections/services").then((mod) => mod.ServicesSection),
  { ssr: true }
);

const HowItWorks = dynamic(
  () => import("@/components/sections/how-it-works").then((mod) => mod.HowItWorks),
  { ssr: true }
);

// FeaturedWork is an async Server Component (it reads projects from the database
// so the case-study links resolve), so it is imported statically — next/dynamic
// with { ssr: true } is for client components and does not await async RSCs.

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

import { getFaqs, getPricingTiers } from "@/lib/data/db-queries";
import { SITE_URL } from "@/lib/config";

// The homepage owns its canonical explicitly, now that the root layout no longer
// applies one to every route.
export const metadata = {
  alternates: {
    canonical: SITE_URL,
    languages: {
      "en-AE": SITE_URL,
      "x-default": SITE_URL,
    },
  },
};

export default async function HomePage() {
  const [faqs, pricingTiers] = await Promise.all([
    getFaqs(),
    getPricingTiers(),
  ]);

  const mappedFaqs = faqs.map((f) => ({ q: f.question, a: f.answer }));

  // The homepage section is a 3-up teaser that links to /pricing for the full
  // list. Pass at most three tiers, always keeping the featured one so the
  // "Most popular" card is present.
  const allTiers = pricingTiers.map((t) => ({
    name: t.name,
    price: t.price.replace(/[^0-9,]/g, "") || t.price,
    description: t.description,
    delivery: t.deliveryTimeframe,
    features: t.features,
    popular: t.isFeatured,
    cta: `Start with ${t.name}`,
  }));

  const featured = allTiers.filter((t) => t.popular);
  const rest = allTiers.filter((t) => !t.popular);
  const mappedTiers =
    allTiers.length <= 3 ? allTiers : [...featured, ...rest].slice(0, 3);

  return (
    <>
      {/* Structured SEO Data for Google Rich Results */}
      <LocalBusinessJsonLd />
      <FaqJsonLd faqs={faqs} />

      {/* Hero & Social Proof - Above the Fold */}
      <HeroSection />
      <TrustStrip />

      {/* Below the Fold Components */}
      <ServicesSection />
      <HowItWorks />
      <FeaturedWork />
      <PricingTeaser tiers={mappedTiers} />
      {/* Previously rendered nowhere on the public site. */}
      <TestimonialsSection />
      <WhyNeuralWaves />
      <FaqSection faqs={mappedFaqs} />
      <FinalCta />
    </>
  );
}
