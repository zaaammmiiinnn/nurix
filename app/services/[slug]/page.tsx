import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MessageSquare, LayoutDashboard, Bot, Check, ArrowRight, MessageCircle, Clock, ShieldCheck, Zap } from "lucide-react";
import { getServiceBySlug, getServices, getSiteSettings } from "@/lib/data/db-queries";
import { ServiceJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";

interface Props {
  params: { slug: string };
}

const ICON_MAP: Record<string, typeof MessageSquare> = {
  chatbots: MessageSquare,
  dashboards: LayoutDashboard,
  agents: Bot,
};

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((s) => ({
    slug: s.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = await getServiceBySlug(params.slug);
  if (!service) return { title: "Service Not Found" };

  return {
    title: service.title,
    description: service.description,
    alternates: {
      canonical: `https://neuralwaves.in/services/${service.slug}`,
      languages: {
        "en-AE": `https://neuralwaves.in/services/${service.slug}`,
        "ar-AE": `https://neuralwaves.in/ar/services/${service.slug}`,
      },
    },
    openGraph: {
      title: `${service.title} — NeuralWaves`,
      description: service.description,
      url: `https://neuralwaves.in/services/${service.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${service.title} — NeuralWaves`,
      description: service.description,
    },
  };
}

export default async function DynamicServicePage({ params }: Props) {
  const [service, siteSettings] = await Promise.all([
    getServiceBySlug(params.slug),
    getSiteSettings(),
  ]);

  if (!service) {
    notFound();
  }

  const Icon = ICON_MAP[service.slug] || MessageSquare;
  const waNumber = (siteSettings.whatsapp_number || "918840936715").replace(/[^0-9]/g, "");
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(service.waText)}`;

  return (
    <div className="pt-28 pb-32 min-h-screen relative overflow-hidden">
      {/* Structured SEO */}
      <ServiceJsonLd service={service} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Services", url: "/services" },
          { name: service.title, url: `/services/${service.slug}` },
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

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        {/* Breadcrumb nav */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-mono text-xs text-zinc-500 mb-8">
          <Link href="/" className="hover:text-white transition-colors">
            HOME
          </Link>
          <span>/</span>
          <Link href="/services" className="hover:text-white transition-colors">
            SERVICES
          </Link>
          <span>/</span>
          <span className="text-zinc-300 uppercase">{service.slug}</span>
        </nav>

        {/* Hero */}
        <div className="max-w-3xl space-y-6 mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-xs font-mono text-violet-300">
            <Icon size={14} />
            <span>01 / {service.slug.toUpperCase()}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.03em] text-white leading-[1.1]">
            {service.title}
          </h1>

          <p className="text-lg sm:text-xl text-zinc-300 leading-relaxed">
            {service.tagline}
          </p>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            {service.description}
          </p>

          {/* SLA badges */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-300 bg-white/[0.04] border border-white/[0.08] px-3.5 py-2 rounded-xl">
              <Clock size={14} className="text-violet-400" />
              <span>{service.delivery} delivery</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-300 bg-white/[0.04] border border-white/[0.08] px-3.5 py-2 rounded-xl">
              <Zap size={14} className="text-cyan-400" />
              <span>{service.pricing}</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-300 bg-white/[0.04] border border-white/[0.08] px-3.5 py-2 rounded-xl">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>14-day warranty</span>
            </div>
          </div>
        </div>

        {/* Deliverables */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-24">
          <div className="lg:col-span-5 space-y-4">
            <span className="font-mono text-xs text-violet-400 uppercase tracking-widest block">
              SCOPE &amp; SPECS
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
              What&apos;s delivered in the sprint.
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Every deliverable is tested against edge cases before sign-off. You own 100% of the code, models, and credentials.
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-8 sm:p-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {service.deliverables.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-zinc-300">
                    <span className="w-5 h-5 rounded-full bg-violet-500/10 border border-violet-500/30 flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={11} className="text-violet-400" />
                    </span>
                    <span className="leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Box */}
        <div className="rounded-3xl border border-white/[0.08] bg-gradient-to-br from-violet-600/[0.08] via-white/[0.02] to-transparent p-8 sm:p-14 text-center max-w-4xl mx-auto space-y-6">
          <span className="font-mono text-xs uppercase tracking-widest text-violet-400">
            START YOUR SPRINT
          </span>
          <h2 className="text-2xl sm:text-4xl font-semibold text-white tracking-tight">
            Ready to deploy {service.title}?
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 max-w-lg mx-auto">
            Book a 15-minute discovery call or chat directly with our engineering team on WhatsApp.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs sm:text-sm font-semibold uppercase tracking-wider text-white btn-glow"
            >
              <MessageCircle size={16} />
              Discuss on WhatsApp
            </a>

            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs sm:text-sm font-mono text-zinc-300 hover:text-white bg-white/[0.04] border border-white/[0.08] hover:border-violet-500/30 transition-colors"
            >
              Submit Project Brief <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
