"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ProjectItem } from "@/lib/data/site-data";

interface ProjectGalleryProps {
  projects: ProjectItem[];
}

export function ProjectGallery({ projects }: ProjectGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "All Projects" },
    { id: "automation", label: "Automation" },
    { id: "agents", label: "AI Agents" },
    { id: "web-apps", label: "Web Applications" },
  ];

  const filtered = projects.filter((p) => {
    if (activeCategory === "all") return true;
    const tag = (p.tag || "").toLowerCase();
    const sector = (p.sector || "").toLowerCase();
    if (activeCategory === "automation") {
      return tag.includes("chatbot") || tag.includes("automation") || sector.includes("automation");
    }
    if (activeCategory === "agents") {
      return tag.includes("agent") || tag.includes("scraping");
    }
    if (activeCategory === "web-apps") {
      return tag.includes("dashboard") || tag.includes("portal") || tag.includes("web");
    }
    return true;
  });

  return (
    <div className="space-y-12">
      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 border-b border-stone/80 pb-6">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 text-xs font-mono transition-colors cursor-pointer ${
              activeCategory === cat.id
                ? "bg-charcoal text-white"
                : "bg-white border border-stone text-charcoal hover:border-charcoal/50"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {filtered.map((project, idx) => {
          const isWide = idx === 0 || idx === 3;
          return (
            <div
              key={project.slug}
              className={`${
                isWide ? "lg:col-span-12" : "lg:col-span-6"
              } border border-stone bg-white p-8 md:p-12 transition-all hover:border-charcoal/60 flex flex-col justify-between`}
            >
              <div>
                {/* Header Metadata */}
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

                {/* Main Content */}
                <div className={`grid grid-cols-1 ${isWide ? "lg:grid-cols-12 gap-10" : "gap-6"} mb-8`}>
                  <div className={isWide ? "lg:col-span-6" : ""}>
                    <h2 className="font-display font-medium text-2xl sm:text-3xl text-charcoal tracking-tight mb-4">
                      {project.title}
                    </h2>
                    <p className="text-sm text-olive leading-relaxed font-sans mb-6">
                      {project.overview}
                    </p>

                    <div className="p-4 border border-stone/80 bg-canvas/60">
                      <span className="mono-label block text-[9px] text-olive uppercase mb-1">
                        MEASURED IMPACT
                      </span>
                      <span className="font-display font-medium text-lg sm:text-xl text-charcoal">
                        {project.resultMetric}
                      </span>
                    </div>
                  </div>

                  <div className={`${isWide ? "lg:col-span-6" : ""} space-y-4`}>
                    <div className="border border-stone/60 p-4 bg-canvas/30">
                      <span className="mono-label block text-[9px] text-olive uppercase mb-1">
                        PROBLEM
                      </span>
                      <p className="text-xs sm:text-sm text-charcoal leading-relaxed font-sans">
                        {project.problem}
                      </p>
                    </div>

                    <div className="border border-stone/60 p-4 bg-canvas/30">
                      <span className="mono-label block text-[9px] text-olive uppercase mb-1">
                        ENGINEERED SOLUTION
                      </span>
                      <p className="text-xs sm:text-sm text-charcoal leading-relaxed font-sans">
                        {project.solution}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
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
                  Read full case study
                  <ArrowUpRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
