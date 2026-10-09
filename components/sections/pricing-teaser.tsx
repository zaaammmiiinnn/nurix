"use client";

import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";

const TIERS = [
  {
    name: "Starter",
    price: "1,500",
    description: "Essential automation for single workflows or support bots.",
    delivery: "3–5 days",
    features: [
      "Custom WhatsApp / Web bot",
      "Lead collection to Google Sheet/Email",
      "Admin configuration dashboard",
      "1 revision round included",
    ],
    popular: false,
    cta: "Start with Starter",
  },
  {
    name: "Growth",
    price: "3,500",
    description: "Full AI conversational assistant integrated into your CRM.",
    delivery: "5–7 days",
    features: [
      "Natural language AI replies (OpenAI/Anthropic)",
      "Multi-channel lead qualification",
      "HubSpot / Zoho / Supabase CRM sync",
      "Automated calendar booking",
      "2 revision rounds included",
    ],
    popular: true,
    cta: "Start with Growth",
  },
  {
    name: "Business",
    price: "7,500",
    description: "Complete end-to-end bespoke system with custom dashboard.",
    delivery: "7–10 days",
    features: [
      "Custom Web app + Admin portal",
      "Autonomous data & reporting agents",
      "Full API integrations & webhooks",
      "30-day post-launch warranty support",
      "Dedicated developer Slack channel",
    ],
    popular: false,
    cta: "Start with Business",
  },
];

interface PricingTeaserProps {
  tiers?: {
    name: string;
    price: string;
    description: string;
    delivery: string;
    features: string[];
    popular: boolean;
    cta: string;
  }[];
}

export function PricingTeaser({ tiers }: PricingTeaserProps = {}) {
  const items = tiers && tiers.length > 0 ? tiers : TIERS;

  /**
   * The homepage now passes every tier in the database (previously 4), but this
   * template was hard-wired to three columns with `items-center`, so a fourth
   * card wrapped onto its own row and broke the "Most popular" centring.
   * Choose the column count from the item count instead.
   */
  const gridCols =
    items.length >= 4
      ? "lg:grid-cols-4"
      : items.length === 3
        ? "lg:grid-cols-3"
        : items.length === 2
          ? "lg:grid-cols-2"
          : "";

  return (
    <section
      id="pricing"
      className="py-32 md:py-40 px-6 md:px-8 max-w-7xl mx-auto select-none"
      aria-labelledby="pricing-heading"
    >
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
        <SectionHeader
          id="pricing-heading"
          label="04 / PRICING"
          title="Transparent pricing. No surprises."
          description="Transparent scoped pricing with zero hourly rate creep. 50% upfront to kick off, 50% only when you approve delivery."
          className="mb-0 md:mb-0"
        />

        <Link
          href="/pricing"
          className="hidden md:inline-flex items-center gap-2 text-sm font-mono text-zinc-400 hover:text-white transition-colors group mb-4"
        >
          See full pricing
          <ArrowRight
            size={14}
            className="group-hover:translate-x-1 transition-transform duration-200"
          />
        </Link>
      </div>

      {/* Tiers side-by-side; column count follows the number of tiers */}
      <div className={`grid grid-cols-1 ${gridCols} gap-8 items-center pt-4`}>
        {items.map((tier) => (
          <div
            key={tier.name}
            className={`rounded-2xl transition-all duration-300 relative flex flex-col justify-between p-8 md:p-9 ${
              tier.popular
                ? "bg-[#0E0E14] border-2 border-violet-500/70 shadow-[0_0_40px_rgba(139,92,246,0.22)] lg:scale-[1.03] lg:z-10 hover:-translate-y-1 hover:shadow-[0_0_60px_rgba(139,92,246,0.35)]"
                : "bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.08] hover:-translate-y-1 hover:border-violet-500/30 hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
            }`}
          >
            {/* Most popular badge */}
            {tier.popular && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="bg-gradient-to-r from-violet-600 to-cyan-500 text-white text-[11px] font-mono uppercase tracking-wider font-semibold px-3.5 py-1 rounded-full shadow-lg">
                  Most popular
                </span>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-lg text-white">{tier.name}</h3>
                  <span className="font-mono text-[10px] text-zinc-500 border border-white/[0.08] px-2 py-0.5 rounded">
                    {tier.delivery}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {tier.description}
                </p>
              </div>

              {/* Price in Inter Display */}
              <div className="flex items-baseline gap-1.5 pt-2 pb-4 border-b border-white/[0.06]">
                <span className="font-mono text-xs text-zinc-500">AED</span>
                <span className="text-4xl sm:text-5xl font-semibold tracking-[-0.04em] text-white">
                  {tier.price}
                </span>
                <span className="text-xs text-zinc-500 font-mono">/ project</span>
              </div>

              {/* Feature list */}
              <ul className="space-y-3.5 text-xs text-zinc-300">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-violet-500/10 border border-violet-500/30 flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={10} className="text-violet-400" />
                    </span>
                    <span className="leading-snug">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA button */}
            <div className="mt-8 pt-4">
              <Link
                href="/contact"
                className={`w-full py-3.5 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider text-center block transition-all duration-200 ${
                  tier.popular
                    ? "btn-glow text-white"
                    : "btn-ghost-border text-zinc-300 hover:text-white"
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom note in mono, muted */}
      <div className="mt-12 text-center">
        <p className="font-mono text-xs text-zinc-500 tracking-wider">
          AED • 50% upfront • 5-day delivery
        </p>
      </div>
    </section>
  );
}
