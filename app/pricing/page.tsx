import type { Metadata } from "next";
import Link from "next/link";
import { Check, MessageCircle, ShieldCheck, Zap } from "lucide-react";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/seo/json-ld";
import { getPricingTiers, getFaqs, getSiteSettings } from "@/lib/data/db-queries";

export const metadata: Metadata = {
  title: "Pricing — Fixed Price AI & Automation",
  description:
    "Transparent, fixed-price AI automation packages for UAE businesses. Starts at AED 1,500. 50% deposit upfront, balance on delivery. No hourly surprises.",
  alternates: {
    canonical: "https://neuralwaves.in/pricing",
    languages: {
      "en-AE": "https://neuralwaves.in/pricing",
      "ar-AE": "https://neuralwaves.in/ar/pricing",
    },
  },
  openGraph: {
    title: "Pricing — NeuralWaves",
    description: "Fixed-price AI automation packages for UAE businesses. From AED 1,500.",
    url: "https://neuralwaves.in/pricing",
    images: [
      {
        url: "/api/og?title=Fixed%20Pricing&subtitle=From%20AED%201%2C500.%20Delivered%20in%20days.&badge=TRANSPARENT%20PRICING",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing — NeuralWaves",
    description: "Fixed-price AI automation packages for UAE businesses.",
  },
};

export default async function PricingPage() {
  const [pricingTiers, allFaqs, siteSettings] = await Promise.all([
    getPricingTiers(),
    getFaqs(),
    getSiteSettings(),
  ]);

  const pricingFaqs = allFaqs.filter((f) => f.category === "pricing" || f.category === "general");
  const waNumber = (siteSettings.whatsapp_number || "918840936715").replace(/[^0-9]/g, "");
  const waBase = `https://wa.me/${waNumber}`;

  return (
    <div className="pt-28 pb-32 min-h-screen relative overflow-hidden">
      {/* Structured SEO */}
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Pricing", url: "/pricing" },
        ]}
      />
      <FaqJsonLd faqs={pricingFaqs} />

      {/* Background glow */}
      <div
        className="absolute top-20 left-1/2 -translate-x-1/2 w-[750px] h-[500px] rounded-full blur-[140px] pointer-events-none opacity-20"
        style={{
          background: "radial-gradient(circle, #8B5CF6 0%, #22D3EE 50%, transparent 75%)",
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        {/* Breadcrumb nav */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-mono text-xs text-zinc-500 mb-8">
          <Link href="/" className="hover:text-white transition-colors">
            HOME
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-zinc-300">PRICING</span>
        </nav>

        {/* Hero */}
        <div className="mb-20 max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-6 h-[1px] bg-violet-500/40 inline-block" aria-hidden="true" />
            <span className="font-mono text-xs uppercase tracking-widest text-violet-400">
              03 / FIXED PRICING
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-[-0.04em] text-white leading-[1.05] mb-6">
            Fixed price. No surprises.
          </h1>

          <p className="text-lg sm:text-xl text-zinc-400 font-normal leading-relaxed">
            Every build is delivered for a locked quote in AED. 50% deposit to initiate the sprint, 50% upon deployment after your acceptance sign-off.
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-6 text-xs font-mono text-zinc-400">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-400" />
              <span>14–30 Day Post-Launch Warranty</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-violet-400" />
              <span>Full Code & IP Ownership</span>
            </div>
          </div>
        </div>

        {/* Pricing Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-28">
          {pricingTiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-2xl p-6 sm:p-7 flex flex-col justify-between border transition-all duration-200 relative ${
                tier.isFeatured
                  ? "border-violet-500/50 bg-[#0F0F1A] shadow-[0_0_40px_rgba(139,92,246,0.15)] ring-1 ring-violet-500/40"
                  : "border-white/[0.08] bg-[#0A0A0F] hover:border-white/[0.16]"
              }`}
            >
              {tier.isFeatured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-600 text-white font-mono text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full shadow-lg">
                  Most Popular
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-white tracking-tight">{tier.name}</h2>
                  <span className="font-mono text-xs text-zinc-500">{tier.deliveryTimeframe}</span>
                </div>

                <div className="mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs font-mono text-zinc-400">AED</span>
                    <span className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-mono">
                      {tier.price}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-2 min-h-[36px]">{tier.description}</p>
                </div>

                <div className="pt-4 border-t border-white/[0.06] space-y-3 mb-8">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-500 block">
                    What&apos;s Included
                  </span>
                  <ul className="space-y-2.5">
                    {tier.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-zinc-300">
                        <Check size={14} className="text-violet-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <Link
                  href={`/contact?tier=${encodeURIComponent(tier.name)}`}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider text-center block transition-all ${
                    tier.isFeatured
                      ? "btn-glow text-white"
                      : "btn-ghost-border text-zinc-300 hover:text-white"
                  }`}
                >
                  {tier.ctaLabel}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing FAQs */}
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2 mb-10">
            <span className="font-mono text-xs uppercase tracking-wider text-violet-400">
              Pricing Clarity
            </span>
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {pricingFaqs.map((faq, i) => (
              <div
                key={i}
                className="p-6 rounded-xl border border-white/[0.08] bg-[#0A0A0F] space-y-2"
              >
                <h3 className="text-base font-semibold text-white tracking-tight">
                  {faq.question}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-24 p-8 sm:p-12 rounded-2xl border border-white/[0.08] bg-[#0A0A0F] text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Need a custom enterprise scope?
          </h2>
          <p className="text-sm text-zinc-400">
            Multi-department workflows, legacy ERP integrations, or high-volume automated scrapers. Let&apos;s map out your project sprint.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/contact"
              className="btn-glow px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-white w-full sm:w-auto"
            >
              Book Scope Call
            </Link>
            <a
              href={`${waBase}?text=Hi%20NeuralWaves%2C%20I%20have%20a%20custom%20AI%20project%20scope`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost-border px-6 py-3 rounded-xl text-xs font-mono uppercase tracking-wider text-zinc-300 hover:text-white w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <MessageCircle size={15} className="text-emerald-400" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
