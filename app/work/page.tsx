import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PROJECTS_DATA } from "@/lib/data/site-data";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Selected Work — Projects Shipped for UAE Businesses",
  description:
    "Real AI projects shipped for UAE businesses in real estate, F&B, healthcare, and logistics. High impact, fixed price, delivered in days.",
  alternates: {
    canonical: "https://neuralwaves.in/work",
    languages: {
      "en-AE": "https://neuralwaves.in/work",
      "ar-AE": "https://neuralwaves.in/ar/work",
    },
  },
  openGraph: {
    title: "Selected Work — NeuralWaves",
    description: "Real AI projects shipped for UAE businesses. Real results, real clients.",
    url: "https://neuralwaves.in/work",
    images: [
      {
        url: "/api/og?title=Selected%20Work&subtitle=Real%20projects%20shipped%20for%20UAE%20businesses.&badge=CASE%20STUDIES",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Selected Work — NeuralWaves",
    description: "AI projects shipped for UAE businesses. Fixed price. Delivered in days.",
  },
};

export default function WorkPage() {
  return (
    <div className="pt-28 pb-32 min-h-screen relative overflow-hidden">
      {/* Structured SEO */}
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Work", url: "/work" },
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

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        {/* Breadcrumb nav */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-mono text-xs text-zinc-500 mb-8">
          <Link href="/" className="hover:text-white transition-colors">
            HOME
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-zinc-300">WORK</span>
        </nav>

        {/* Hero */}
        <div className="mb-20 max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-6 h-[1px] bg-violet-500/40 inline-block" aria-hidden="true" />
            <span className="font-mono text-xs uppercase tracking-widest text-violet-400">
              02 / PORTFOLIO
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-[-0.04em] text-white leading-[1.05] mb-6">
            Shipped for real businesses.
          </h1>

          <p className="text-lg sm:text-xl text-zinc-400 font-normal leading-relaxed">
            No speculative pitch decks or vaporware. Every system below was architected, coded, and deployed for UAE SMEs in under 10 days.
          </p>

          <div className="flex items-center gap-6 pt-4 text-xs font-mono text-zinc-400">
            <span>12+ Projects Shipped</span>
            <span>•</span>
            <span>5-Day Average Turnaround</span>
            <span>•</span>
            <span>100% Fixed Quotes</span>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-28">
          {PROJECTS_DATA.map((project) => (
            <article
              key={project.slug}
              className="rounded-2xl border border-white/[0.08] bg-[#0A0A0F] hover:border-violet-500/40 transition-all duration-200 p-8 flex flex-col justify-between group shadow-xl hover:shadow-violet-900/10"
            >
              <div>
                {/* Meta badge row */}
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 rounded-md">
                      {project.tag}
                    </span>
                    <span className="font-mono text-xs text-zinc-500">
                      {project.sector}
                    </span>
                  </div>
                  <span className="font-mono text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                    {project.resultMetric}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-white tracking-tight mb-3 group-hover:text-violet-200 transition-colors">
                  <Link href={`/work/${project.slug}`}>
                    {project.title}
                  </Link>
                </h2>

                <p className="text-xs font-mono text-zinc-400 mb-4">
                  Client: {project.client}
                </p>

                <p className="text-sm text-zinc-300 leading-relaxed mb-6">
                  {project.overview}
                </p>

                {/* Tech stack pills */}
                <div className="flex flex-wrap gap-1.5 mb-8">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="font-mono text-[11px] text-zinc-400 bg-white/[0.04] border border-white/[0.06] px-2.5 py-1 rounded-md"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer Link */}
              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <span className="font-mono text-xs text-zinc-500">
                  Sprint: {project.deliveryDays}
                </span>

                <Link
                  href={`/work/${project.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-violet-400 hover:text-white transition-colors group-hover:translate-x-1 transition-transform"
                >
                  Read Case Study
                  <ArrowRight size={14} />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Call to action */}
        <div className="p-10 rounded-2xl border border-white/[0.08] bg-[#0A0A0F] text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Want to see your workflow in our next sprint?
          </h2>
          <p className="text-sm text-zinc-400">
            Tell us what repetitive process is slowing your team down. We&apos;ll scope the build and deliver in days.
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="btn-glow inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white"
            >
              Start a sprint
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
