import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { ProjectGallery } from "@/components/work/project-gallery";
import { getProjects } from "@/lib/data/db-queries";
import { SITE_URL } from "@/lib/config";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Work & Case Studies — NeuralWaves",
  description:
    "Production AI systems and custom digital software shipped for businesses in India & the UAE. Verified outcomes, system architectures, and technical breakdowns.",
  alternates: {
    canonical: `${SITE_URL}/work`,
  },
};

export default async function WorkPage() {
  const projects = await getProjects();
  const shipped = projects.filter((p) => !p.isDemo).length;
  const demos = projects.filter((p) => p.isDemo).length;

  return (
    <div className="pt-32 pb-36 min-h-screen bg-canvas">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Work", url: "/work" },
        ]}
      />

      <div className="container-editorial">
        {/* Breadcrumb nav */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-mono text-xs text-olive mb-10">
          <Link href="/" className="hover:text-charcoal transition-colors">
            HOME
          </Link>
          <span className="text-stone">/</span>
          <span className="text-charcoal uppercase">WORK</span>
        </nav>

        {/* Hero */}
        <div className="mb-16 md:mb-24 max-w-4xl">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 bg-charcoal inline-block" />
            <p className="mono-label text-olive tracking-widest text-[11px] uppercase">
              PORTFOLIO // VERIFIED IMPLEMENTATIONS
            </p>
          </div>

          <h1 className="font-display font-medium text-4xl sm:text-5xl md:text-6xl text-charcoal tracking-tight leading-[1.08] mb-6">
            Shipped for real businesses. <br className="hidden sm:inline" />
            <span className="text-charcoal/70">Documented end-to-end.</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-olive leading-relaxed font-sans max-w-2xl mb-8">
            No speculative prototypes or conceptual vaporware. Every case study below details the operational friction replaced, the technical architecture deployed, and the verified outcome.
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-mono text-olive border-t border-stone/80">
            <span>
              <strong className="text-charcoal font-semibold">{shipped}</strong> VERIFIED CLIENT {shipped === 1 ? "BUILD" : "BUILDS"}
            </span>
            {demos > 0 && (
              <span>
                <strong className="text-charcoal font-semibold">{demos}</strong> INTERNAL DEMO {demos === 1 ? "BUILD" : "BUILDS"}
              </span>
            )}
            <span>UAE & INDIA REGION</span>
          </div>
        </div>

        {/* Filterable Project Gallery */}
        <ProjectGallery projects={projects} />

        {/* Bottom CTA Block */}
        <div className="mt-24 border border-charcoal bg-charcoal text-white p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl">
            <span className="mono-label text-[10px] text-stone/70 uppercase">CUSTOM SCOPING</span>
            <h3 className="font-display font-medium text-2xl sm:text-3xl text-white">
              Have a similar operational challenge in your business?
            </h3>
            <p className="text-xs sm:text-sm text-stone/80 font-sans leading-relaxed">
              We review your existing workflow and provide a fixed-price scoping architecture within 4 business hours.
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
