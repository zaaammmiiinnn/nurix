import type { Metadata } from "next";
import Link from "next/link";
import { MessageSquare, Check, ArrowRight, MessageCircle, Clock, ShieldCheck, Zap } from "lucide-react";
import { SERVICES_DATA } from "@/lib/data/site-data";
import { ServiceJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const FALLBACK_SERVICE = SERVICES_DATA[0]; // chatbots

/**
 * Metadata is generated from the database — the same source the page body uses.
 * It previously came from the static SERVICES_DATA entry while the body rendered
 * the database row, so after any admin edit the <title> and OG tags disagreed
 * with the content of the page.
 *
 * The previous OG image also carried a hardcoded, unverifiable metric claim
 * (e.g. "Save 25h/week"); that has been dropped.
 */
export async function generateMetadata(): Promise<Metadata> {
  const service = (await getServiceBySlug("chatbots")) || FALLBACK_SERVICE;

  return {
    title: service.title,
    description: service.description,
    alternates: {
      canonical: `${SITE_URL}/services/${service.slug}`,
      languages: {
        "en-AE": `${SITE_URL}/services/${service.slug}`,
      },
    },
    openGraph: {
      title: `${service.title} — NeuralWaves`,
      description: service.description,
      url: `${SITE_URL}/services/${service.slug}`,
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(service.title)}&subtitle=${encodeURIComponent(service.tagline)}&badge=${encodeURIComponent("AI Chatbots")}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${service.title} — NeuralWaves`,
      description: service.description,
    },
  };
}
import { getServiceBySlug, getSiteSettings } from "@/lib/data/db-queries";
import { SITE_URL } from "@/lib/config";

export default async function ChatbotsPage() {
  const [dbService, siteSettings] = await Promise.all([
    getServiceBySlug("chatbots"),
    getSiteSettings(),
  ]);
  const activeService = dbService || FALLBACK_SERVICE;
  const waNumber = (siteSettings.whatsapp_number || "918840936715").replace(/[^0-9]/g, "");
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(activeService.waText)}`;

  return (
    <div className="pt-28 pb-32 min-h-screen relative overflow-hidden">
      {/* Structured SEO */}
      <ServiceJsonLd service={activeService} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Services", url: "/services" },
          { name: activeService.title, url: `/services/${activeService.slug}` },
        ]}
      />

      {/* Background glow */}
      <div
        className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[450px] rounded-full blur-[140px] pointer-events-none opacity-20"
        style={{
          background: "radial-gradient(circle, #8B5CF6 0%, #22D3EE 60%, transparent 80%)",
        }}
        aria-hidden="true"
      />

      <div className="max-w-5xl mx-auto px-6 md:px-8 relative z-10">
        {/* Breadcrumb nav */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-mono text-xs text-zinc-500 mb-8">
          <Link href="/" className="hover:text-white transition-colors">
            HOME
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/services" className="hover:text-white transition-colors">
            SERVICES
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-zinc-300 uppercase">{activeService.slug}</span>
        </nav>

        {/* Hero */}
        <div className="space-y-6 mb-16">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
              <MessageSquare size={22} className="text-violet-400" />
            </div>
            <span className="font-mono text-xs uppercase tracking-widest text-violet-400 border border-violet-500/20 bg-violet-500/10 px-3 py-1 rounded-full">
              Offer {activeService.number} • {activeService.delivery} Delivery
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-[-0.04em] text-white leading-[1.05]">
            {activeService.title}
          </h1>

          <p className="text-xl sm:text-2xl text-zinc-300 font-medium leading-relaxed max-w-3xl">
            {activeService.tagline}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <span className="bg-white/[0.04] border border-white/[0.08] px-4 py-2 rounded-xl text-sm font-mono text-white">
              Fixed: {activeService.pricing}
            </span>
            <span className="bg-white/[0.04] border border-white/[0.08] px-4 py-2 rounded-xl text-sm font-mono text-zinc-300 flex items-center gap-2">
              <Clock size={14} className="text-violet-400" />
              {activeService.delivery} average sprint
            </span>
            <span className="bg-white/[0.04] border border-white/[0.08] px-4 py-2 rounded-xl text-sm font-mono text-zinc-300 flex items-center gap-2">
              <ShieldCheck size={14} className="text-emerald-400" />
              14-Day Warranty
            </span>
          </div>
        </div>

        {/* Deep Dive Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="md:col-span-2 space-y-8">
            <div className="p-8 rounded-2xl border border-white/[0.08] bg-[#0A0A0F] space-y-4">
              <h2 className="text-xl font-semibold text-white tracking-tight">Overview</h2>
              <p className="text-zinc-300 leading-relaxed">{activeService.longDescription}</p>
            </div>

            <div className="p-8 rounded-2xl border border-white/[0.08] bg-[#0A0A0F] space-y-6">
              <h2 className="text-xl font-semibold text-white tracking-tight">Deliverables Checklist</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeService.deliverables.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-sm text-zinc-300">
                    <span className="w-5 h-5 rounded-full bg-violet-500/10 border border-violet-500/30 flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={12} className="text-violet-400" />
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0A0A0F] space-y-4">
              <h2 className="text-base font-semibold text-white tracking-tight">Key Business Benefits</h2>
              <ul className="space-y-3">
                {activeService.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-zinc-300">
                    <Zap size={14} className="text-violet-400 shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0A0A0F] space-y-4">
              <h2 className="text-base font-semibold text-white tracking-tight">Ideal For</h2>
              <ul className="space-y-2">
                {activeService.idealFor.map((item, i) => (
                  <li key={i} className="text-xs text-zinc-400 border-l border-violet-500/40 pl-3">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="p-8 sm:p-10 rounded-2xl border border-violet-500/30 bg-gradient-to-r from-violet-950/20 via-[#0A0A0F] to-cyan-950/20 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 text-center sm:text-left">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Ready to ship your WhatsApp bot?
            </h2>
            <p className="text-sm text-zinc-400">
              Starts at AED 1,500. 50% deposit to begin. Shipped in 3–5 working days.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-glow px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-white flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <MessageCircle size={16} className="text-emerald-400" />
              Discuss on WhatsApp
            </a>
            <Link
              href="/contact"
              className="btn-ghost-border px-6 py-3 rounded-xl text-xs font-mono uppercase tracking-wider text-zinc-300 hover:text-white flex items-center justify-center gap-1.5 w-full sm:w-auto"
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
