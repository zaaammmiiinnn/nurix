import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin, ShieldCheck, Clock } from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "About — Dubai AI Automation Studio",
  description:
    "Nurix is a Dubai-based AI automation studio building production chatbots, dashboards, and AI agents for UAE SMEs. Fast, fixed-price, delivered in days.",
  alternates: {
    canonical: "https://nurix.ae/about",
    languages: {
      "en-AE": "https://nurix.ae/about",
      "ar-AE": "https://nurix.ae/ar/about",
    },
  },
  openGraph: {
    title: "About — Nurix AI Studio Dubai",
    description: "Fast, fixed-price AI automation for UAE businesses. Delivered in days, not months.",
    url: "https://nurix.ae/about",
    images: [
      {
        url: "/api/og?title=About%20Nurix&subtitle=Dubai-based%20AI%20automation%20studio.&badge=ABOUT%20US",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About — Nurix",
    description: "Dubai-based AI automation studio. We ship AI.",
  },
};

export default function AboutPage() {
  return (
    <div className="pt-28 pb-32 min-h-screen relative overflow-hidden">
      {/* Structured SEO */}
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "About", url: "/about" },
        ]}
      />

      {/* Background glow */}
      <div
        className="absolute top-20 left-1/2 -translate-x-1/2 w-[750px] h-[500px] rounded-full blur-[140px] pointer-events-none opacity-20"
        style={{
          background: "radial-gradient(circle, #8B5CF6 0%, #22D3EE 50%, transparent 75%)",
        }}
        aria-hidden="true"
      />

      <div className="max-w-4xl mx-auto px-6 md:px-8 relative z-10">
        {/* Breadcrumb nav */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-mono text-xs text-zinc-500 mb-8">
          <Link href="/" className="hover:text-white transition-colors">
            HOME
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-zinc-300">ABOUT</span>
        </nav>

        {/* Hero */}
        <div className="mb-20 max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-6 h-[1px] bg-violet-500/40 inline-block" aria-hidden="true" />
            <span className="font-mono text-xs uppercase tracking-widest text-violet-400">
              04 / ABOUT NURIX
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-[-0.04em] text-white leading-[1.05] mb-6">
            We build AI that ships.
          </h1>

          <p className="text-lg sm:text-xl text-zinc-400 font-normal leading-relaxed">
            Most software agencies spend months producing slide decks, wireframes, and bloated retainers. Nurix was founded on a simple premise: UAE businesses need working software in production, delivered in days.
          </p>
        </div>

        {/* Studio Tenets */}
        <div className="space-y-12 mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0A0A0F] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                <Clock size={20} />
              </div>
              <h2 className="text-lg font-semibold text-white tracking-tight">5-Day Turnaround</h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                We work in intense 5-to-10 day engineering sprints. We don&apos;t take on more than 3 client sprints at a time.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0A0A0F] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <ShieldCheck size={20} />
              </div>
              <h2 className="text-lg font-semibold text-white tracking-tight">100% Fixed Quotes</h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                No open-ended billing or surprise hourly invoices. 50% deposit to initiate, 50% on verified production delivery.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0A0A0F] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <MapPin size={20} />
              </div>
              <h2 className="text-lg font-semibold text-white tracking-tight">UAE & GCC Native</h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Based in Dubai. We understand WhatsApp commerce, local payment gateways, Khaleeji Arabic nuances, and UAE regulations.
              </p>
            </div>
          </div>

          {/* Narrative */}
          <div className="p-8 sm:p-10 rounded-2xl border border-white/[0.08] bg-[#0A0A0F] space-y-6">
            <h2 className="text-2xl font-bold text-white tracking-tight">Why Nurix Exists</h2>
            <div className="space-y-4 text-zinc-300 leading-relaxed text-sm sm:text-base">
              <p>
                In 2026, generative AI models have become commodities. Anyone can query an LLM via an API. The bottleneck is no longer model intelligence—it is operational engineering.
              </p>
              <p>
                How do you wire an AI assistant to your WhatsApp Business Cloud account with zero downtime? How do you ensure it never hallucinates property prices or inventory levels? How do you build an internal dashboard your team actually enjoys using instead of fighting Excel sheets?
              </p>
              <p>
                That is what Nurix builds. Production-grade software that automates real workflows and returns measurable time and revenue to business owners across Dubai, Abu Dhabi, and the Northern Emirates.
              </p>
            </div>

            <div className="pt-4 border-t border-white/[0.06] flex items-center gap-3 text-xs font-mono text-zinc-400">
              <MapPin size={14} className="text-violet-400" />
              <span>DIFC Gate Precinct, Dubai, United Arab Emirates</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="p-10 rounded-2xl border border-violet-500/30 bg-gradient-to-r from-violet-950/20 via-[#0A0A0F] to-cyan-950/20 text-center space-y-4 shadow-2xl">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Have a workflow you want automated?
          </h2>
          <p className="text-sm text-zinc-400 max-w-lg mx-auto">
            Book a 15-minute scoping call. We&apos;ll tell you honestly if AI is the right tool for your problem.
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="btn-glow inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white"
            >
              Book a call
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
