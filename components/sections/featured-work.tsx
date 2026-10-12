import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { getProjects } from "@/lib/data/db-queries";

export async function FeaturedWork() {
  const allProjects = await getProjects();
  // Show first 3 projects, ensuring client projects are prioritized
  const projects = allProjects.slice(0, 3);

  return (
    <section
      id="work"
      className="py-24 md:py-36 border-b border-stone/80 bg-canvas"
      aria-labelledby="work-heading"
    >
      <div className="container-editorial">
        {/* Section Header */}
        <div className="mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 bg-charcoal inline-block" />
            <p className="mono-label text-olive tracking-widest text-[11px] uppercase">
              03 // SELECTED CASE STUDIES
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <h2
                id="work-heading"
                className="font-display font-medium text-3xl sm:text-4xl md:text-5xl text-charcoal tracking-tight"
              >
                Engineered for utility. <br className="hidden sm:inline" />
                Validated in production.
              </h2>
            </div>
            <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-between">
              <p className="text-sm md:text-base text-olive leading-relaxed font-sans mb-4 lg:mb-0">
                Detailed architecture breakdowns of production software deployed for businesses in the UAE and India.
              </p>
              <Link
                href="/work"
                className="inline-flex items-center text-xs font-mono uppercase tracking-wider text-charcoal font-medium border-b border-charcoal pb-1 transition-colors hover:text-olive hover:border-olive group"
              >
                View all case studies
                <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* Varied Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {projects.map((project, idx) => {
            const isWide = idx === 0;
            return (
              <div
                key={project.slug}
                className={`${
                  isWide ? "lg:col-span-12" : "lg:col-span-6"
                } border border-stone bg-white p-8 md:p-12 transition-all hover:border-charcoal/60 flex flex-col justify-between`}
              >
                <div>
                  {/* Top Metadata Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-stone/70 mb-8 text-[11px] font-mono">
                    <div className="flex items-center gap-3">
                      <span className="text-charcoal font-semibold uppercase">{project.sector || project.tag}</span>
                      <span className="text-stone">/</span>
                      <span className="text-olive">{project.client}</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 text-[10px] tracking-wider uppercase font-mono border ${
                        project.isDemo
                          ? "bg-canvas text-olive border-stone"
                          : "bg-charcoal text-white border-charcoal"
                      }`}
                    >
                      {project.isDemo ? "INTERNAL DEMO BUILD" : "VERIFIED CLIENT SYSTEM"}
                    </span>
                  </div>

                  {/* Title & Challenge/Solution Split */}
                  <div className={`grid grid-cols-1 ${isWide ? "lg:grid-cols-12 gap-10" : "gap-6"} mb-8`}>
                    <div className={isWide ? "lg:col-span-6" : ""}>
                      <h3 className="font-display font-medium text-2xl sm:text-3xl text-charcoal tracking-tight mb-4">
                        {project.title}
                      </h3>
                      <p className="text-sm text-olive leading-relaxed font-sans mb-6">
                        {project.overview}
                      </p>
                      
                      {/* Metric Banner */}
                      <div className="p-4 border border-stone/80 bg-canvas/60">
                        <span className="mono-label block text-[9px] text-olive uppercase mb-1">
                          VERIFIED OUTCOME
                        </span>
                        <span className="font-display font-medium text-lg sm:text-xl text-charcoal">
                          {project.resultMetric}
                        </span>
                      </div>
                    </div>

                    <div className={`${isWide ? "lg:col-span-6" : ""} space-y-4`}>
                      <div className="border border-stone/60 p-4 bg-canvas/30">
                        <span className="mono-label block text-[9px] text-olive uppercase mb-1">
                          BUSINESS PROBLEM
                        </span>
                        <p className="text-xs sm:text-sm text-charcoal leading-relaxed">
                          {project.problem}
                        </p>
                      </div>

                      <div className="border border-stone/60 p-4 bg-canvas/30">
                        <span className="mono-label block text-[9px] text-olive uppercase mb-1">
                          ENGINEERED SOLUTION
                        </span>
                        <p className="text-xs sm:text-sm text-charcoal leading-relaxed">
                          {project.solution}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tech Stack & Case Study Link */}
                <div className="pt-6 border-t border-stone/70 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    {project.techStack?.map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-1 text-[10px] font-mono bg-canvas border border-stone text-olive"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/work/${project.slug}`}
                    className="inline-flex items-center text-xs font-mono uppercase tracking-wider text-charcoal font-medium hover:text-olive transition-colors group"
                  >
                    Read case study
                    <ArrowUpRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
