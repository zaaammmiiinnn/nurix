import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, ShieldCheck, Building, Sparkles } from "lucide-react";
import { getProjects, getProjectBySlug } from "@/lib/data/db-queries";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { SITE_URL } from "@/lib/config";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  if (!project) return { title: "Project Not Found" };

  return {
    title: project.title,
    description: `${project.overview} Impact: ${project.resultMetric}.`,
    alternates: {
      canonical: `${SITE_URL}/work/${project.slug}`,
      languages: {
        "en-AE": `${SITE_URL}/work/${project.slug}`,
      },
    },
    openGraph: {
      title: `${project.title} — NeuralWaves Case Study`,
      description: project.overview,
      url: `${SITE_URL}/work/${project.slug}`,
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(project.title)}&subtitle=${encodeURIComponent(project.overview)}&badge=${encodeURIComponent(project.sector)}&metric=${encodeURIComponent(project.resultMetric)}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} — NeuralWaves`,
      description: project.overview,
    },
  };
}

export default async function WorkSlugPage({ params }: Props) {
  const project = await getProjectBySlug(params.slug);
  if (!project) notFound();

  return (
    <div className="pt-28 pb-32 min-h-screen relative overflow-hidden">
      {/* Structured SEO */}
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Work", url: "/work" },
          { name: project.title, url: `/work/${project.slug}` },
        ]}
      />

      {/* Background glow */}
      <div
        className="absolute top-20 left-1/2 -translate-x-1/2 w-[750px] h-[450px] rounded-full blur-[140px] pointer-events-none opacity-20"
        style={{
          background: "radial-gradient(circle, #8B5CF6 0%, #22D3EE 60%, transparent 80%)",
        }}
        aria-hidden="true"
      />

      <div className="max-w-4xl mx-auto px-6 md:px-8 relative z-10">
        {/* Back navigation & Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 font-mono text-xs text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            BACK TO ALL WORK
          </Link>

          <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-2 font-mono text-xs text-zinc-500">
            <Link href="/" className="hover:text-white transition-colors">
              HOME
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/work" className="hover:text-white transition-colors">
              WORK
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-zinc-300 uppercase">{project.tag}</span>
          </nav>
        </div>

        {/* Hero */}
        <div className="space-y-6 mb-16">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-widest text-violet-400 border border-violet-500/20 bg-violet-500/10 px-3 py-1 rounded-full">
              {project.tag}
            </span>
            <span className="font-mono text-xs text-zinc-400 bg-white/[0.04] border border-white/[0.08] px-3 py-1 rounded-full">
              Sector: {project.sector}
            </span>
            <span className="font-mono text-xs text-zinc-400 bg-white/[0.04] border border-white/[0.08] px-3 py-1 rounded-full flex items-center gap-1.5">
              <Clock size={12} className="text-violet-400" />
              Shipped in {project.deliveryDays}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.04em] text-white leading-[1.1]">
            {project.title}
          </h1>

          <div className="flex items-center gap-3 text-sm text-zinc-400 font-mono">
            <Building size={16} className="text-zinc-500" />
            <span>Client: {project.client}</span>
          </div>

          {/* Big Result Metric Box */}
          <div className="p-6 sm:p-8 rounded-2xl border border-emerald-500/30 bg-emerald-950/10 backdrop-blur-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="font-mono text-[11px] uppercase tracking-wider text-emerald-400 block mb-1">
                Verified Outcome
              </span>
              <p className="text-2xl sm:text-3xl font-bold text-white font-mono">
                {project.resultMetric}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <ShieldCheck size={16} className="text-emerald-400" />
              <span>Production Deployed</span>
            </div>
          </div>
        </div>

        {/* Challenge & Solution Grid */}
        <div className="space-y-10 mb-16">
          {/* Problem */}
          <section className="p-8 rounded-2xl border border-white/[0.08] bg-[#0A0A0F] space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" aria-hidden="true" />
              <h2 className="text-lg font-semibold text-white tracking-tight">The Operational Problem</h2>
            </div>
            <p className="text-zinc-300 leading-relaxed text-base sm:text-lg">
              {project.problem}
            </p>
          </section>

          {/* Solution */}
          <section className="p-8 rounded-2xl border border-white/[0.08] bg-[#0A0A0F] space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-violet-400" aria-hidden="true" />
              <h2 className="text-lg font-semibold text-white tracking-tight">The Engineered Solution</h2>
            </div>
            <p className="text-zinc-300 leading-relaxed text-base sm:text-lg">
              {project.solution}
            </p>
          </section>

          {/* Tech Stack */}
          <section className="p-8 rounded-2xl border border-white/[0.08] bg-[#0A0A0F] space-y-6">
            <h2 className="text-lg font-semibold text-white tracking-tight">Production Tech Stack</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {project.techStack.map((tech) => (
                <div
                  key={tech}
                  className="p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] flex items-center gap-2 text-xs font-mono text-zinc-300"
                >
                  <Sparkles size={14} className="text-violet-400 shrink-0" />
                  <span>{tech}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* CTA */}
        <div className="p-8 sm:p-10 rounded-2xl border border-violet-500/30 bg-gradient-to-r from-violet-950/20 via-[#0A0A0F] to-cyan-950/20 text-center space-y-4 shadow-2xl">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Need a similar system for your business?
          </h2>
          <p className="text-sm text-zinc-400 max-w-lg mx-auto">
            We deliver systems like this in days, with locked fixed pricing and full IP handover.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/contact"
              className="btn-glow px-8 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-white w-full sm:w-auto"
            >
              Discuss your project
            </Link>
            <Link
              href="/work"
              className="btn-ghost-border px-6 py-3 rounded-xl text-xs font-mono uppercase tracking-wider text-zinc-300 hover:text-white w-full sm:w-auto"
            >
              View other case studies
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
