import Link from "next/link";
import { Check, ArrowRight, ArrowUpRight } from "lucide-react";

interface PricingTeaserProps {
  tiers?: unknown[];
}

const CONFIRMED_TIERS = [
  {
    name: "Starter",
    price: "2,500",
    currency: "AED",
    idealFor: "Solo founders, boutique clinics, and single-location services needing 24/7 lead capture.",
    delivery: "3–5 Days",
    included: [
      "Official Meta WhatsApp or Web conversational assistant",
      "Lead qualification & instant email / Google Sheets dispatch",
      "Bilingual Arabic or English greeting & intent matching",
      "Staging sandbox review & 1 round of calibration",
    ],
    integrationScope: "Single endpoint (Sheets / Email / Webhook)",
    exclusions: "Third-party Meta & OpenAI API fees (billed direct at cost)",
    cta: "Select Starter",
    featured: false,
  },
  {
    name: "Growth",
    price: "3,500",
    currency: "AED",
    idealFor: "High-volume real estate brokers, hospitality, and B2B agencies converting ad traffic.",
    delivery: "5–7 Days",
    included: [
      "Bilingual Arabic + English natural language conversational bot",
      "Bi-directional CRM sync (HubSpot, Salesforce, Zoho, or Supabase)",
      "Automated calendar booking (Cal.com / Google Calendar)",
      "Intelligent human handover alert system",
      "2 rounds of prompt and workflow calibration",
    ],
    integrationScope: "Full CRM + Calendar + Meta Cloud API",
    exclusions: "Third-party WhatsApp conversation & model usage costs",
    cta: "Select Growth",
    featured: true,
  },
  {
    name: "Business",
    price: "7,500",
    currency: "AED",
    idealFor: "Multi-branch operators, logistics teams, and clinics replacing manual back-office tasks.",
    delivery: "10–14 Days",
    included: [
      "Full Next.js operational web dashboard + Admin portal",
      "Autonomous data processing & document extraction agents",
      "Multi-user role-based access control (RBAC)",
      "Real-time database records on Supabase PostgreSQL",
      "30-day post-launch warranty & developer support",
    ],
    integrationScope: "Full Web Portal + Custom Agents + ERP Sync",
    exclusions: "Cloud server hosting fees & third-party SaaS licenses",
    cta: "Select Business",
    featured: false,
  },
];

export function PricingTeaser({ tiers: _tiers }: PricingTeaserProps = {}) {
  return (
    <section
      id="pricing"
      className="py-24 md:py-36 border-b border-stone/80 bg-canvas"
      aria-labelledby="pricing-heading"
    >
      <div className="container-editorial">
        {/* Section Header */}
        <div className="mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 bg-charcoal inline-block" />
            <p className="mono-label text-olive tracking-widest text-[11px] uppercase">
              04 // TRANSPARENT COMMERCIAL PACKAGES
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <h2
                id="pricing-heading"
                className="font-display font-medium text-3xl sm:text-4xl md:text-5xl text-charcoal tracking-tight"
              >
                Fixed-price engineering. <br className="hidden sm:inline" />
                No hidden agency retainers.
              </h2>
            </div>
            <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-between">
              <p className="text-sm md:text-base text-olive leading-relaxed font-sans mb-4 lg:mb-0">
                50% upfront to initiate sprint, 50% upon verified staging sign-off. All prices quoted in UAE Dirhams (AED) and INR equivalent.
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center text-xs font-mono uppercase tracking-wider text-charcoal font-medium border-b border-charcoal pb-1 transition-colors hover:text-olive hover:border-olive group"
              >
                View full scope comparison
                <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* 3 Core Packages Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {CONFIRMED_TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`border p-8 md:p-10 flex flex-col justify-between transition-all ${
                tier.featured
                  ? "border-charcoal bg-white shadow-md relative"
                  : "border-stone bg-white/70 hover:border-charcoal/50"
              }`}
            >
              {tier.featured && (
                <div className="absolute -top-3 left-8 px-2.5 py-0.5 bg-charcoal text-white text-[10px] font-mono uppercase tracking-widest">
                  MOST REQUESTED SPRINT
                </div>
              )}

              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-stone/70 mb-6">
                  <h3 className="font-display font-medium text-xl text-charcoal">{tier.name}</h3>
                  <span className="text-[11px] font-mono text-olive uppercase">
                    EST. {tier.delivery}
                  </span>
                </div>

                {/* Price Display */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-xs text-olive">{tier.currency}</span>
                    <span className="font-display font-semibold text-4xl sm:text-5xl text-charcoal tracking-tight">
                      {tier.price}
                    </span>
                    <span className="font-mono text-xs text-olive">/ sprint</span>
                  </div>
                </div>

                {/* Ideal For */}
                <div className="mb-6 pb-6 border-b border-stone/60">
                  <span className="mono-label block text-[9px] text-olive uppercase mb-1">
                    IDEAL FIT
                  </span>
                  <p className="text-xs text-charcoal/90 leading-relaxed font-sans">
                    {tier.idealFor}
                  </p>
                </div>

                {/* Inclusions */}
                <div className="space-y-3 mb-6">
                  <span className="mono-label block text-[9px] text-olive uppercase">
                    INCLUDED DELIVERABLES
                  </span>
                  <ul className="space-y-2.5 text-xs text-charcoal">
                    {tier.included.map((inc, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-charcoal shrink-0 mt-0.5" />
                        <span className="leading-snug">{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Exclusions Note */}
                <div className="p-3 bg-canvas/60 border border-stone/60 text-[11px] text-olive font-mono mb-8">
                  <span className="font-semibold block text-[9px] text-charcoal uppercase mb-0.5">EXCLUSIONS</span>
                  {tier.exclusions}
                </div>
              </div>

              {/* Action Button */}
              <Link
                href={`/contact?package=${encodeURIComponent(tier.name)}`}
                className={`w-full py-3.5 px-4 text-xs font-mono uppercase tracking-wider text-center block transition-colors ${
                  tier.featured
                    ? "bg-charcoal text-white hover:bg-black"
                    : "border border-charcoal text-charcoal hover:bg-charcoal hover:text-white"
                }`}
              >
                {tier.cta} →
              </Link>
            </div>
          ))}
        </div>

        {/* Custom Enterprise Card Banner */}
        <div className="mt-8 border border-stone bg-white p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="mono-label text-[10px] text-olive uppercase">CUSTOM ARCHITECTURE</span>
            <h4 className="font-display font-medium text-xl text-charcoal">Need a bespoke multi-agent system or internal ERP?</h4>
            <p className="text-xs sm:text-sm text-olive max-w-2xl font-sans">
              For complex multi-tenant platforms, custom vision pipelines, or private VPC cloud deployments with dedicated SLA maintenance agreements.
            </p>
          </div>
          <Link
            href="/contact?package=Enterprise"
            className="btn-editorial-primary shrink-0"
          >
            Discuss Custom Scope
            <ArrowUpRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}
