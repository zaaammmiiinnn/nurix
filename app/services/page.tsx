import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { SITE_URL } from "@/lib/config";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Services — NeuralWaves",
  description:
    "Disciplined AI engineering and digital systems for businesses in India & the UAE. Conversational WhatsApp bots, autonomous workflows, and custom web apps.",
  alternates: {
    canonical: `${SITE_URL}/services`,
  },
};

const SERVICES = [
  {
    number: "01",
    href: "/services/ai-chatbots",
    tag: "CONVERSATIONAL COMMERCE",
    title: "AI Chatbots & WhatsApp Automation",
    headline: "Turn conversations into completed work.",
    description:
      "Customer communications in the UAE and India start on WhatsApp. We engineer verified Meta Cloud API bots capable of qualification, booking, and catalog navigation in fluent Arabic and English.",
    deliverables: [
      "Official Meta WhatsApp Cloud API (zero markup)",
      "Bilingual Arabic (MSA & Gulf) and English NLP",
      "Automated bi-directional CRM syncing",
      "Cal.com & Google Calendar booking",
    ],
    pricing: "From AED 2,500",
    delivery: "3–5 days",
  },
  {
    number: "02",
    href: "/services/ai-agents",
    tag: "AUTONOMOUS WORKFLOWS",
    title: "AI Agents & Business Workflows",
    headline: "From repetitive tasks to intelligent workflows.",
    description:
      "Autonomous background workers engineered to handle multi-step business operations: lead scraping, document parsing, invoice reconciliation, and daily briefings with strict human approval gates.",
    deliverables: [
      "PDF & trade license OCR extraction",
      "Deterministic policy & business rule guards",
      "Human-in-the-loop executive sign-off checks",
      "Immutable audit log telemetry",
    ],
    pricing: "From AED 7,500",
    delivery: "7–10 days",
  },
  {
    number: "03",
    href: "/services/web-apps",
    tag: "OPERATIONAL INTERFACES",
    title: "Web Applications & Admin Dashboards",
    headline: "Replace scattered tools with one clear view.",
    description:
      "Custom operations portals, internal tools, and client dashboards built on Next.js, PostgreSQL, and low-latency WebSockets to replace fragile spreadsheets.",
    deliverables: [
      "Granular Role-Based Access Control (RBAC)",
      "Real-time WebSocket data streaming",
      "Mobile-optimized views for field operators",
      "Full source code & IP handover",
    ],
    pricing: "From AED 7,500",
    delivery: "7–14 days",
  },
];

export default function ServicesPage() {
  return (
    <div className="pt-32 pb-36 min-h-screen bg-canvas">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Services", url: "/services" },
        ]}
      />

      <div className="container-editorial">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-mono text-xs text-olive mb-10">
          <Link href="/" className="hover:text-charcoal transition-colors">
            HOME
          </Link>
          <span className="text-stone">/</span>
          <span className="text-charcoal uppercase">SERVICES</span>
        </nav>

        {/* Hero Section */}
        <div className="mb-20 md:mb-28 max-w-4xl">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 bg-charcoal inline-block" />
            <p className="mono-label text-olive tracking-widest text-[11px] uppercase">
              CAPABILITIES // THREE CORE DOMAINS
            </p>
          </div>

          <h1 className="font-display font-medium text-4xl sm:text-5xl md:text-6xl text-charcoal tracking-tight leading-[1.08] mb-6">
            Services. <br className="hidden sm:inline" />
            <span className="text-charcoal/70">Engineered with precision.</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-olive leading-relaxed font-sans max-w-2xl">
            We do not offer dozens of generic services. We focus strictly on three high-impact digital systems that eliminate busywork and accelerate commercial operations.
          </p>
        </div>

        {/* Services List */}
        <div className="space-y-12 mb-24">
          {SERVICES.map((service) => (
            <div
              key={service.number}
              className="border border-stone bg-white p-8 md:p-12 lg:p-16 transition-all hover:border-charcoal/60"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                <div className="lg:col-span-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 flex items-center justify-center font-mono text-xs font-semibold text-charcoal bg-canvas border border-stone">
                      {service.number}
                    </span>
                    <span className="mono-label text-[10px] text-olive uppercase">{service.tag}</span>
                  </div>

                  <h2 className="font-display font-medium text-2xl sm:text-3xl text-charcoal tracking-tight">
                    {service.title}
                  </h2>

                  <p className="font-display text-base text-charcoal/80 font-normal">
                    {service.headline}
                  </p>

                  <p className="text-xs sm:text-sm text-olive leading-relaxed font-sans">
                    {service.description}
                  </p>

                  <div className="pt-4">
                    <Link
                      href={service.href}
                      className="inline-flex items-center text-xs font-mono uppercase tracking-wider text-charcoal font-medium border-b border-charcoal pb-1 transition-colors hover:text-olive hover:border-olive group"
                    >
                      Inspect dedicated architecture & simulator
                      <ArrowUpRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-7 bg-canvas/40 border border-stone/70 p-6 sm:p-8 space-y-6">
                  <div>
                    <span className="mono-label block text-[10px] text-olive uppercase mb-3">
                      KEY PRODUCTION DELIVERABLES
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {service.deliverables.map((item, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-charcoal font-sans">
                          <Check className="w-3.5 h-3.5 text-charcoal shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone/60 flex items-center justify-between text-xs font-mono text-olive">
                    <div>
                      <span className="block text-[9px] uppercase text-olive/70">COMMERCIAL SPRINT</span>
                      <span className="font-semibold text-charcoal">{service.pricing}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] uppercase text-olive/70 text-right">TIMEFRAME</span>
                      <span className="font-semibold text-charcoal text-right block">{service.delivery}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Block */}
        <div className="border border-charcoal bg-charcoal text-white p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl">
            <span className="mono-label text-[10px] text-stone/70 uppercase">DIRECT CONSULTATION</span>
            <h3 className="font-display font-medium text-2xl sm:text-3xl text-white">
              Not sure which system fits your operational bottleneck?
            </h3>
            <p className="text-xs sm:text-sm text-stone/80 font-sans leading-relaxed">
              Schedule a 15-minute engineering feasibility call. We analyze your tech stack and give you a fixed scope quotation with zero sales pitch.
            </p>
          </div>

          <Link
            href="/contact"
            className="px-6 py-3.5 bg-white text-charcoal font-mono text-xs uppercase tracking-wider font-semibold hover:bg-stone transition-colors shrink-0"
          >
            Discuss a Project →
          </Link>
        </div>
      </div>
    </div>
  );
}
