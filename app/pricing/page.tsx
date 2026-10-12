import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { PricingGrid } from "@/components/pricing/pricing-grid";
import { FaqSection } from "@/components/sections/faq";
import { SITE_URL } from "@/lib/config";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Pricing & Packages — NeuralWaves",
  description:
    "Fixed-price AI engineering sprints for businesses in India & the UAE. Starter from AED 2,500, Growth from AED 3,500, Business from AED 7,500. 50% upfront, 50% upon delivery.",
  alternates: {
    canonical: `${SITE_URL}/pricing`,
  },
};

const COMMERCIAL_TERMS = [
  {
    title: "50% Upfront, 50% on Delivery",
    desc: "We bill 50% to lock engineering sprint dates and commence architectural design. The remaining 50% is only payable once staging has been thoroughly validated and signed off by your team.",
  },
  {
    title: "Zero API & Token Markup",
    desc: "Third-party messaging charges (Meta WhatsApp Business Cloud API) and AI foundation model tokens (OpenAI GPT-4o, Claude 3.5) are linked directly to your corporate payment card at cost price.",
  },
  {
    title: "30-Day Post-Launch Warranty",
    desc: "Every deployment includes a full month of post-launch warranty support covering edge-case tuning, prompt calibration, and zero-downtime maintenance.",
  },
  {
    title: "100% IP & Code Ownership",
    desc: "You retain full intellectual property ownership. We execute a clean transfer of the GitHub repository, database schemas, and cloud deployment pipelines upon project completion.",
  },
];

export default function PricingPage() {
  return (
    <div className="pt-32 pb-36 min-h-screen bg-canvas">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Pricing", url: "/pricing" },
        ]}
      />

      <div className="container-editorial">
        {/* Breadcrumb nav */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-mono text-xs text-olive mb-10">
          <Link href="/" className="hover:text-charcoal transition-colors">
            HOME
          </Link>
          <span className="text-stone">/</span>
          <span className="text-charcoal uppercase">PRICING</span>
        </nav>

        {/* Hero */}
        <div className="mb-16 md:mb-24 max-w-4xl">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 bg-charcoal inline-block" />
            <p className="mono-label text-olive tracking-widest text-[11px] uppercase">
              COMMERCIAL PACKAGES // FIXED QUOTES
            </p>
          </div>

          <h1 className="font-display font-medium text-4xl sm:text-5xl md:text-6xl text-charcoal tracking-tight leading-[1.08] mb-6">
            Fixed scope. Fixed price. <br className="hidden sm:inline" />
            <span className="text-charcoal/70">Zero hourly surprises.</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-olive leading-relaxed font-sans max-w-2xl">
            We operate in locked sprints with guaranteed turnaround times. Know your exact commercial commitment before a single line of code is written.
          </p>
        </div>

        {/* Pricing Grid with AED & INR Toggle */}
        <div className="mb-24">
          <PricingGrid />
        </div>

        {/* Commercial Policies & Delivery Framework */}
        <div className="border border-stone bg-white p-8 md:p-14 mb-24 space-y-8">
          <div className="max-w-2xl">
            <span className="mono-label text-[10px] text-olive uppercase">COMMERCIAL FRAMEWORK</span>
            <h2 className="font-display font-medium text-3xl text-charcoal mt-2">
              Payment Terms, Warranties & Governance
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            {COMMERCIAL_TERMS.map((term, idx) => (
              <div key={idx} className="p-6 border border-stone bg-canvas/40 space-y-2">
                <span className="mono-label text-[10px] text-olive uppercase">POLICY 0{idx + 1}</span>
                <h3 className="font-display font-medium text-lg text-charcoal">{term.title}</h3>
                <p className="text-xs sm:text-sm text-olive leading-relaxed font-sans">{term.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Embedded FAQ */}
        <FaqSection />
      </div>
    </div>
  );
}
