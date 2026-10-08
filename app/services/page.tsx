import type { Metadata } from "next";
import Link from "next/link";
import { MessageSquare, LayoutDashboard, Bot, ArrowRight, Check, MessageCircle } from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Three things. Done properly. Custom AI Chatbots, Web & Admin Dashboards, and AI Agents for UAE businesses.",
  alternates: {
    canonical: "https://nurix.ae/services",
    languages: {
      "en-AE": "https://nurix.ae/services",
      "ar-AE": "https://nurix.ae/ar/services",
    },
  },
  openGraph: {
    title: "Services — Nurix",
    description:
      "Three things. Done properly. Custom AI Chatbots, Web & Admin Dashboards, and AI Agents for UAE businesses.",
    url: "https://nurix.ae/services",
    images: [
      {
        url: "/api/og?title=Services&subtitle=Three%20things.%20Done%20properly.&badge=SERVICES",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Services — Nurix",
    description: "Three things. Done properly. Chatbots, dashboards, and AI agents for UAE businesses.",
  },
};

const WA_BASE = "https://wa.me/971501234567";

const SERVICES_DATA = [
  {
    number: "01",
    slug: "chatbots",
    icon: MessageSquare,
    title: "AI Chatbots & WhatsApp Automation",
    tagline: "Menu bots, AI replies, and human handoff — on the app your customers already use.",
    description:
      "Customer communication in the UAE happens on WhatsApp. We engineer verified Meta Cloud API bots and website assistants capable of instant lead capture, catalog browsing, and reservation bookings in fluent Arabic and English.",
    deliverables: [
      "Custom WhatsApp Cloud API verification & setup",
      "Menu flows + natural language AI replies (OpenAI / Claude)",
      "Instant calendar booking & reservation engine",
      "Seamless human agent takeover & escalation desk",
      "CRM & Google Sheets real-time lead sync",
      "Arabic (MSA & Gulf) + English dual-language fluency",
    ],
    pricing: "From AED 1,500",
    delivery: "3–5 days",
    waText: "Hi Nurix, I want to discuss WhatsApp & AI Chatbots",
  },
  {
    number: "02",
    slug: "dashboards",
    icon: LayoutDashboard,
    title: "Web & Admin Dashboards",
    tagline: "Custom dashboards for the operations you're running on spreadsheets.",
    description:
      "Replace fragile, slow spreadsheets with secure, blazingly fast internal portals. We build tailored admin panels, client viewing portals, and KPI consoles with real-time permissions and sub-second load times.",
    deliverables: [
      "Custom Next.js & React UI tailored to your ops workflow",
      "Role-based access control (RBAC) & secure auth",
      "Real-time database sync (Postgres / Supabase / Firebase)",
      "Instant multi-column search, filtering & CSV/PDF exports",
      "Live activity logs, audit trails & team permissioning",
      "Fully responsive mobile & tablet layouts for field teams",
    ],
    pricing: "From AED 2,500",
    delivery: "5–7 days",
    waText: "Hi Nurix, I want to discuss Web & Admin Dashboards",
  },
  {
    number: "03",
    slug: "agents",
    icon: Bot,
    title: "AI Agents for Business",
    tagline: "Lead gen, scraping, reporting. Agents that work while you sleep.",
    description:
      "Autonomous software workers designed to execute multi-step operations without human babysitting. Scrape market data, qualify incoming leads, parse messy vendor invoices, and push formatted briefings to your phone each morning.",
    deliverables: [
      "Autonomous scheduled scrapers & market intel collectors",
      "Automated lead qualification and enrichment pipelines",
      "OCR invoice, receipt, and PDF data extraction",
      "Daily executive summary briefings sent via WhatsApp or Email",
      "Multi-system glue connecting disparate APIs and webhooks",
      "Error recovery queues and audit monitoring",
    ],
    pricing: "From AED 7,500",
    delivery: "7–10 days",
    waText: "Hi Nurix, I want to discuss AI Agents for Business",
  },
];

export default function ServicesPage() {
  return (
    <div className="pt-28 pb-32 min-h-screen relative overflow-hidden select-none">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Services", url: "/services" },
        ]}
      />
      {/* Background radial gradient */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[550px] rounded-full blur-[140px] pointer-events-none opacity-20"
        style={{
          background: "radial-gradient(circle, #8B5CF6 0%, #22D3EE 50%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 font-mono text-xs text-zinc-500 mb-8">
          <Link href="/" className="hover:text-white transition-colors">
            HOME
          </Link>
          <span>/</span>
          <span className="text-zinc-300">SERVICES</span>
        </div>

        {/* Hero */}
        <div className="mb-24 md:mb-32 max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-6 h-[1px] bg-violet-500/40 inline-block" aria-hidden="true" />
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
              01 / SERVICES
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-semibold tracking-[-0.04em] text-white leading-[0.95] mb-6">
            Services.
          </h1>

          <p className="text-xl sm:text-2xl text-zinc-400 font-normal leading-relaxed">
            Three things. Done properly.
          </p>
        </div>

        {/* 3 Large Service Blocks — Full-width alternating layout with sticky left title */}
        <div className="space-y-28 md:space-y-40">
          {SERVICES_DATA.map((service) => {
            const Icon = service.icon;
            const waUrl = `${WA_BASE}?text=${encodeURIComponent(service.waText)}`;

            return (
              <section
                key={service.slug}
                id={service.slug}
                className="border-t border-white/[0.08] pt-16 md:pt-20 scroll-mt-24"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                  {/* Left Column: Sticky Title, Icon, Badge & Link */}
                  <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                        <Icon size={26} className="text-violet-400" />
                      </div>
                      <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest border border-white/[0.08] px-3 py-1 rounded-full">
                        Offer {service.number}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-white leading-tight">
                        {service.title}
                      </h2>
                      <p className="text-base text-violet-300/90 font-medium">
                        {service.tagline}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono text-zinc-400 pt-2">
                      <span className="bg-white/[0.04] border border-white/[0.08] px-3 py-1.5 rounded-lg">
                        {service.pricing}
                      </span>
                      <span className="bg-white/[0.04] border border-white/[0.08] px-3 py-1.5 rounded-lg">
                        {service.delivery} delivery
                      </span>
                    </div>

                    <div className="pt-2">
                      <Link
                        href={`/services/${service.slug}`}
                        className="inline-flex items-center gap-2 text-sm font-mono text-zinc-300 hover:text-white group transition-colors"
                      >
                        Deep dive into {service.title.split("&")[0].trim()}
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>

                  {/* Right Column: Deep Narrative, Deliverables Checklist & WhatsApp CTA */}
                  <div className="lg:col-span-7 space-y-10">
                    <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-8 sm:p-10 space-y-8">
                      <div>
                        <h3 className="font-mono text-xs uppercase tracking-wider text-zinc-500 mb-3">
                          The Problem & Scope
                        </h3>
                        <p className="text-base text-zinc-300 leading-relaxed">
                          {service.description}
                        </p>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-mono text-xs uppercase tracking-wider text-zinc-500">
                          Included Deliverables
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          {service.deliverables.map((item, i) => (
                            <div key={i} className="flex items-start gap-2.5 text-xs text-zinc-300">
                              <span className="w-4 h-4 rounded-full bg-violet-500/10 border border-violet-500/30 flex items-center justify-center shrink-0 mt-0.5">
                                <Check size={10} className="text-violet-400" />
                              </span>
                              <span className="leading-snug">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-glow flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-white w-full sm:w-auto"
                        >
                          <MessageCircle size={15} className="text-emerald-400" />
                          Discuss this →
                        </a>

                        <Link
                          href="/contact"
                          className="btn-ghost-border flex items-center justify-center px-6 py-3 rounded-xl text-xs font-mono uppercase tracking-wider text-zinc-300 hover:text-white w-full sm:w-auto"
                        >
                          Book Scope Call
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </div>

        {/* Bottom CTA: "Not sure which fits? Book a 15-min call." */}
        <div className="mt-36 sm:mt-44 p-10 sm:p-14 rounded-3xl border border-white/[0.08] bg-[#0A0A0F] text-center max-w-4xl mx-auto space-y-6 relative overflow-hidden shadow-2xl">
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              background: "radial-gradient(circle at center, #8B5CF6 0%, transparent 70%)",
            }}
          />

          <div className="relative z-10 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-white">
              Not sure which fits?
            </h2>
            <p className="text-base sm:text-lg text-zinc-400 max-w-lg mx-auto">
              Book a 15-minute call. We&apos;ll assess your current operations, identify the highest-leverage automation, and give you a fixed quote.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="btn-glow px-8 py-3.5 rounded-xl text-sm font-semibold text-white w-full sm:w-auto"
              >
                Book a 15-min call
              </Link>
              <a
                href={WA_BASE}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost-border px-8 py-3.5 rounded-xl text-sm font-medium text-zinc-300 hover:text-white w-full sm:w-auto flex items-center justify-center gap-2"
              >
                <MessageCircle size={16} className="text-emerald-400" />
                WhatsApp us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
