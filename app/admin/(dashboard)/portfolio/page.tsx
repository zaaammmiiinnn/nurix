import React from "react";
import Link from "next/link";
import {
  FolderKanban,
  ExternalLink,
  Plus,
  Sparkles,
  Clock,
  Building,
  TrendingUp,
} from "lucide-react";
import { PROJECTS_DATA } from "@/lib/data/site-data";

export default function AdminPortfolioPage() {
  return (
    <div className="space-y-8 select-none">
      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-violet-400" />
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">
              CMS · Case Studies
            </span>
          </div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Portfolio &amp; Client Projects
          </h1>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            Manage public case studies, deliverables, tech stacks, and impact metrics
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/work"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost-border px-3.5 py-2 rounded-xl text-xs font-mono text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink size={14} className="text-zinc-400" />
            View Public Showcase
          </Link>
          <button
            type="button"
            className="btn-glow px-4 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 shadow-md opacity-90 cursor-default"
          >
            <Plus size={14} />
            Add Project
          </button>
        </div>
      </div>

      {/* ── Metric Highlights ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.01] space-y-2">
          <span className="text-zinc-400 text-xs font-mono block">Published Studies</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold font-mono text-white">{PROJECTS_DATA.length}</span>
            <span className="text-[11px] font-mono text-violet-400">100% Live</span>
          </div>
          <p className="text-[11px] text-zinc-500">Publicly indexable case studies</p>
        </div>

        <div className="p-5 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.01] space-y-2">
          <span className="text-zinc-400 text-xs font-mono block">Average Sprint</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold font-mono text-white">5.8d</span>
            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-0.5">
              <TrendingUp size={12} /> Fast SLA
            </span>
          </div>
          <p className="text-[11px] text-zinc-500">From brief signoff to deployment</p>
        </div>

        <div className="p-5 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.01] space-y-2">
          <span className="text-zinc-400 text-xs font-mono block">Featured Spotlights</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold font-mono text-white">
              {PROJECTS_DATA.filter((p) => p.isFeatured).length}
            </span>
            <span className="text-[11px] font-mono text-cyan-400">Homepage Grid</span>
          </div>
          <p className="text-[11px] text-zinc-500">Pinned to homepage showcase</p>
        </div>

        <div className="p-5 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.01] space-y-2">
          <span className="text-zinc-400 text-xs font-mono block">Tech Stacks Active</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold font-mono text-white">8+</span>
            <span className="text-[11px] font-mono text-zinc-400">Meta · Next · OpenAI</span>
          </div>
          <p className="text-[11px] text-zinc-500">Cloud APIs and modern stacks</p>
        </div>
      </div>

      {/* ── Projects List ── */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0A0A0F] overflow-hidden">
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderKanban size={16} className="text-violet-400" />
            <h2 className="text-sm font-semibold text-white">All Portfolio Projects</h2>
          </div>
          <span className="font-mono text-xs text-zinc-500">
            {PROJECTS_DATA.length} records
          </span>
        </div>

        <div className="divide-y divide-white/[0.06]">
          {PROJECTS_DATA.map((project) => (
            <div
              key={project.slug}
              className="p-6 hover:bg-white/[0.01] transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              <div className="space-y-3 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-violet-500/10 text-violet-400 border border-violet-500/20">
                    {project.tag}
                  </span>
                  <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
                    <Building size={12} className="text-zinc-500" />
                    {project.client}
                  </span>
                  <span className="text-xs font-mono text-zinc-500">·</span>
                  <span className="text-xs font-mono text-zinc-400">{project.sector}</span>
                  {project.isFeatured && (
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1">
                      <Sparkles size={10} /> Featured
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-semibold text-white tracking-tight">
                    {project.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed line-clamp-2">
                    {project.overview}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.06] text-[11px] font-mono text-zinc-400"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4 shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0 border-white/[0.06]">
                <div className="text-left lg:text-right space-y-1">
                  <span className="px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-block">
                    {project.resultMetric}
                  </span>
                  <div className="text-[11px] font-mono text-zinc-500 flex items-center lg:justify-end gap-1">
                    <Clock size={11} /> {project.deliveryDays}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/work/${project.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost-border px-3 py-1.5 rounded-lg text-xs font-mono text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors"
                  >
                    <span>Live Page</span>
                    <ExternalLink size={12} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
