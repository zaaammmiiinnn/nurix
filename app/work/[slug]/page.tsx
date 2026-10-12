import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getProjectBySlug } from "@/lib/data/db-queries";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { SITE_URL } from "@/lib/config";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return {
    title: `${project.title} — NeuralWaves Case Study`,
    description: `${project.overview} Verified Impact: ${project.resultMetric}.`,
    alternates: {
      canonical: `${SITE_URL}/work/${project.slug}`,
    },
    openGraph: {
      title: `${project.title} — NeuralWaves Case Study`,
      description: project.overview,
      url: `${SITE_URL}/work/${project.slug}`,
    },
  };
}

export default async function WorkSlugPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <div className="pt-32 pb-36 min-h-screen bg-canvas">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Work", url: "/work" },
          { name: project.title, url: `/work/${project.slug}` },
        ]}
      />

      <div className="container-editorial">
        {/* Back Link */}
        <div className="mb-10">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 font-mono text-xs text-olive hover:text-charcoal transition-colors group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            BACK TO SELECTED WORK
          </Link>
        </div>

        {/* Case Study Header Block */}
        <div className="border border-stone bg-white p-8 md:p-14 mb-14">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-stone/70 mb-8 text-[11px] font-mono">
            <div className="flex items-center gap-3">
              <span className="text-charcoal font-semibold uppercase">{project.sector || project.tag}</span>
              <span className="text-stone">/</span>
              <span className="text-olive">{project.client}</span>
            </div>
            <span
              className={`px-2.5 py-0.5 text-[10px] tracking-wider uppercase font-mono border ${
                project.isDemo
                  ? "bg-canvas text-olive border-stone"
                  : "bg-charcoal text-white border-charcoal"
              }`}
            >
              {project.isDemo ? "INTERNAL DEMO ARCHITECTURE" : "PRODUCTION CLIENT SYSTEM"}
            </span>
          </div>

          <h1 className="font-display font-medium text-3xl sm:text-4xl md:text-5xl text-charcoal tracking-tight leading-[1.1] mb-6">
            {project.title}
          </h1>

          <p className="text-base sm:text-lg text-olive leading-relaxed font-sans max-w-3xl mb-8">
            {project.overview}
          </p>

          {/* Outcome Metric Banner */}
          <div className="p-6 border border-stone bg-canvas/70 max-w-xl">
            <span className="mono-label block text-[10px] text-olive uppercase mb-1">
              VERIFIED BUSINESS OUTCOME
            </span>
            <span className="font-display font-semibold text-2xl sm:text-3xl text-charcoal">
              {project.resultMetric}
            </span>
            <span className="block text-xs font-mono text-olive mt-1">
              Delivered in {project.deliveryDays} sprint
            </span>
          </div>
        </div>

        {/* Challenge & Engineered Solution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14">
          <div className="p-8 md:p-10 border border-stone bg-white space-y-4">
            <span className="mono-label text-[10px] text-olive uppercase">THE PROBLEM</span>
            <h2 className="font-display font-medium text-2xl text-charcoal">
              Operational Friction
            </h2>
            <p className="text-sm text-charcoal/90 leading-relaxed font-sans">
              {project.problem}
            </p>
          </div>

          <div className="p-8 md:p-10 border border-stone bg-white space-y-4">
            <span className="mono-label text-[10px] text-olive uppercase">THE SOLUTION</span>
            <h2 className="font-display font-medium text-2xl text-charcoal">
              Engineered Architecture
            </h2>
            <p className="text-sm text-charcoal/90 leading-relaxed font-sans">
              {project.solution}
            </p>
          </div>
        </div>

        {/* Technical Architecture & Stack */}
        <div className="border border-stone bg-white p-8 md:p-12 mb-14 space-y-6">
          <span className="mono-label text-[10px] text-olive uppercase">TECHNICAL FOUNDATION</span>
          <h2 className="font-display font-medium text-2xl sm:text-3xl text-charcoal">
            Stack & Integration Infrastructure
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
            {project.techStack?.map((tech, idx) => (
              <div
                key={idx}
                className="p-3 bg-canvas border border-stone text-xs font-mono text-charcoal font-medium text-center"
              >
                {tech}
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-stone/60 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-olive font-sans">
            <div>
              <strong className="block font-mono text-charcoal uppercase text-[11px] mb-1">
                DATA PRIVACY & RESIDENCY
              </strong>
              All database schemas and vector weights deployed directly into customer-controlled cloud infrastructure with zero third-party training data exposure.
            </div>
            <div>
              <strong className="block font-mono text-charcoal uppercase text-[11px] mb-1">
                SOURCE CODE & IP RETENTION
              </strong>
              Full repository transfer executed upon production launch sign-off with comprehensive API documentation and environment runbooks.
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="border border-charcoal bg-charcoal text-white p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-2 max-w-xl">
            <span className="mono-label text-[10px] text-stone/70 uppercase">SIMILAR SYSTEM SCOPE</span>
            <h3 className="font-display font-medium text-2xl sm:text-3xl text-white">
              Interested in deploying a similar build?
            </h3>
            <p className="text-xs sm:text-sm text-stone/80 font-sans leading-relaxed">
              We analyze your operational bottlenecks, specify fixed deliverables, and ship within days.
            </p>
          </div>

          <Link
            href={`/contact?project=${encodeURIComponent(project.title)}`}
            className="px-6 py-3.5 bg-white text-charcoal font-mono text-xs uppercase tracking-wider font-semibold hover:bg-stone transition-colors shrink-0"
          >
            Discuss a Similar Build →
          </Link>
        </div>
      </div>
    </div>
  );
}
