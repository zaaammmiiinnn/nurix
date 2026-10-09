"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FolderKanban,
  ExternalLink,
  Plus,
  Sparkles,
  Clock,
  Building,
  TrendingUp,
  Search,
  Edit2,
  Trash2,
  X,
  Check,
  Loader2,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import {
  type AdminProject,
  createAdminProject,
  updateAdminProject,
  deleteAdminProject,
  uploadProjectImage,
} from "@/app/admin/portfolio/actions";

interface PortfolioCrudProps {
  initialProjects: AdminProject[];
}

export function PortfolioCrud({ initialProjects }: PortfolioCrudProps) {
  const [projects, setProjects] = useState<AdminProject[]>(initialProjects);
  const [search, setSearch] = useState("");
  const [sectorFilter, setSectorFilter] = useState("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<AdminProject | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    client: "",
    sector: "Real Estate",
    tag: "AI Chatbot",
    result_metric: "",
    overview: "",
    problem: "",
    solution: "",
    tech_stack_raw: "Next.js 14, Meta WhatsApp Cloud API, OpenAI GPT-4o, Supabase",
    image_url: "",
    is_demo: false,
    is_featured: false,
    delivery_days: "5 days",
  });

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      client: "",
      sector: "Real Estate",
      tag: "AI Chatbot",
      result_metric: "",
      overview: "",
      problem: "",
      solution: "",
      tech_stack_raw: "Next.js 14, Meta WhatsApp Cloud API, OpenAI GPT-4o, Supabase",
      image_url: "",
      is_demo: false,
      is_featured: false,
      delivery_days: "5 days",
    });
    setEditingProject(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project: AdminProject) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      slug: project.slug,
      client: project.client,
      sector: project.sector,
      tag: project.tag,
      result_metric: project.result_metric,
      overview: project.overview,
      problem: project.problem,
      solution: project.solution,
      tech_stack_raw: project.tech_stack.join(", "),
      image_url: project.image_url || "",
      is_demo: project.is_demo,
      is_featured: project.is_featured,
      delivery_days: project.delivery_days,
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const data = new FormData();
      data.append("file", file);
      const res = await uploadProjectImage(data);
      if (res.success && res.url) {
        setFormData((prev) => ({ ...prev, image_url: res.url! }));
        toast.success("Screenshot uploaded to 'projects' bucket");
      } else {
        toast.error(res.message || "Failed to upload image");
      }
    } catch {
      toast.error("Image upload failed");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.slug) {
      toast.error("Title and slug are required.");
      return;
    }

    setIsSubmitting(true);
    const techStack = formData.tech_stack_raw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      if (editingProject && editingProject.id) {
        const res = await updateAdminProject(editingProject.id, {
          title: formData.title,
          slug: formData.slug,
          client: formData.client,
          sector: formData.sector,
          tag: formData.tag,
          result_metric: formData.result_metric,
          overview: formData.overview,
          problem: formData.problem,
          solution: formData.solution,
          tech_stack: techStack,
          image_url: formData.image_url,
          is_demo: formData.is_demo,
          is_featured: formData.is_featured,
          delivery_days: formData.delivery_days,
        });

        if (res.success) {
          setProjects((prev) =>
            prev.map((p) =>
              p.id === editingProject.id
                ? {
                    ...p,
                    ...formData,
                    tech_stack: techStack,
                  }
                : p
            )
          );
          toast.success("Project updated successfully");
          setIsModalOpen(false);
          resetForm();
        } else {
          toast.error(res.message || "Failed to update project");
        }
      } else {
        const res = await createAdminProject({
          title: formData.title,
          slug: formData.slug,
          client: formData.client,
          sector: formData.sector,
          tag: formData.tag,
          result_metric: formData.result_metric,
          overview: formData.overview,
          problem: formData.problem,
          solution: formData.solution,
          tech_stack: techStack,
          image_url: formData.image_url,
          is_demo: formData.is_demo,
          is_featured: formData.is_featured,
          delivery_days: formData.delivery_days,
        });

        if (res.success && res.project) {
          setProjects((prev) => [res.project!, ...prev]);
          toast.success("Project created successfully");
          setIsModalOpen(false);
          resetForm();
        } else {
          toast.error(res.message || "Failed to create project");
        }
      }
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      const res = await deleteAdminProject(id);
      if (res.success) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        toast.success("Project deleted successfully");
      } else {
        toast.error(res.message || "Failed to delete project");
      }
    } catch {
      toast.error("Failed to delete project");
    }
  };

  // Filtered List
  const sectors = ["all", ...Array.from(new Set(projects.map((p) => p.sector).filter(Boolean)))];
  const filteredProjects = projects.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.client.toLowerCase().includes(search.toLowerCase()) ||
      p.tag.toLowerCase().includes(search.toLowerCase());
    const matchSector = sectorFilter === "all" || p.sector === sectorFilter;
    return matchSearch && matchSector;
  });

  return (
    <div className="space-y-8 select-none">
      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-violet-400" />
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">
              CMS · Projects Table
            </span>
          </div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Portfolio CRUD Management
          </h1>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            Create, edit, feature, and manage projects &amp; client case studies in real-time
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
            Public View
          </Link>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="btn-glow px-4 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 shadow-md transition-transform active:scale-95"
          >
            <Plus size={14} />
            New Project
          </button>
        </div>
      </div>

      {/* ── Metrics Bar ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#0A0A0F] space-y-2">
          <span className="text-zinc-400 text-xs font-mono block">Total Projects</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold font-mono text-white">{projects.length}</span>
            <span className="text-[11px] font-mono text-violet-400">In Database</span>
          </div>
          <p className="text-[11px] text-zinc-500">Live projects &amp; case studies</p>
        </div>

        <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#0A0A0F] space-y-2">
          <span className="text-zinc-400 text-xs font-mono block">Featured on Home</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold font-mono text-white">
              {projects.filter((p) => p.is_featured).length}
            </span>
            <span className="text-[11px] font-mono text-cyan-400">Hero Section</span>
          </div>
          <p className="text-[11px] text-zinc-500">Visible on homepage grid</p>
        </div>

        <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#0A0A0F] space-y-2">
          <span className="text-zinc-400 text-xs font-mono block">Interactive Demos</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold font-mono text-white">
              {projects.filter((p) => p.is_demo).length}
            </span>
            <span className="text-[11px] font-mono text-amber-400">Simulations</span>
          </div>
          <p className="text-[11px] text-zinc-500">Interactive sandbox previews</p>
        </div>

        <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#0A0A0F] space-y-2">
          <span className="text-zinc-400 text-xs font-mono block">Average SLA</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold font-mono text-white">5.8d</span>
            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-0.5">
              <TrendingUp size={12} /> Fixed Days
            </span>
          </div>
          <p className="text-[11px] text-zinc-500">Turnaround timeframe</p>
        </div>
      </div>

      {/* ── Search & Filters ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search projects by title, client, or tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {sectors.map((sec) => (
            <button
              key={sec}
              onClick={() => setSectorFilter(sec)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase transition-colors shrink-0 ${
                sectorFilter === sec
                  ? "bg-violet-500/20 border border-violet-500/40 text-violet-300"
                  : "bg-white/[0.02] border border-white/[0.06] text-zinc-400 hover:text-white"
              }`}
            >
              {sec}
            </button>
          ))}
        </div>
      </div>

      {/* ── Projects List ── */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0A0A0F] overflow-hidden">
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderKanban size={16} className="text-violet-400" />
            <h2 className="text-sm font-semibold text-white">Project Registry</h2>
          </div>
          <span className="font-mono text-xs text-zinc-500">
            {filteredProjects.length} of {projects.length} displayed
          </span>
        </div>

        <div className="divide-y divide-white/[0.06]">
          {filteredProjects.map((project) => (
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
                  {project.is_featured && (
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1">
                      <Sparkles size={10} /> Featured
                    </span>
                  )}
                  {project.is_demo && (
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      Interactive Demo
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
                  {project.tech_stack.map((tech) => (
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
                    {project.result_metric}
                  </span>
                  <div className="text-[11px] font-mono text-zinc-500 flex items-center lg:justify-end gap-1">
                    <Clock size={11} /> {project.delivery_days}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/work/${project.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.08] text-zinc-400 hover:text-white transition-colors"
                    title="View live case study"
                  >
                    <ExternalLink size={13} />
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleOpenEdit(project)}
                    className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.08] text-zinc-400 hover:text-violet-400 transition-colors"
                    title="Edit project"
                  >
                    <Edit2 size={13} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(project.id)}
                    className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.08] text-zinc-400 hover:text-rose-400 transition-colors"
                    title="Delete project"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredProjects.length === 0 && (
            <div className="p-12 text-center text-xs font-mono text-zinc-500 space-y-2">
              <FolderKanban size={24} className="mx-auto text-zinc-600 mb-2" />
              <p>No projects match your current filter.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Modal Dialog: Create / Edit ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl border border-white/[0.1] bg-[#0E0E14] p-6 sm:p-8 space-y-6 shadow-2xl relative my-8">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {editingProject ? "Edit Project" : "New Portfolio Project"}
                </h3>
                <p className="text-xs font-mono text-zinc-400">
                  {editingProject ? `Updating /work/${editingProject.slug}` : "Add a project to the public showcase"}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.04] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase text-zinc-400 block">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Dubai Real Estate WhatsApp Concierge"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase text-zinc-400 block">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. dubai-real-estate-whatsapp-bot"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase text-zinc-400 block">
                    Client Name
                  </label>
                  <input
                    type="text"
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    placeholder="e.g. Apex Luxury Real Estate"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase text-zinc-400 block">
                    Industry Sector
                  </label>
                  <input
                    type="text"
                    value={formData.sector}
                    onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                    placeholder="e.g. Real Estate, F&B, Logistics"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase text-zinc-400 block">
                    Service Tag
                  </label>
                  <input
                    type="text"
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    placeholder="e.g. AI Chatbot, Admin Dashboard"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase text-zinc-400 block">
                    Key Result Metric
                  </label>
                  <input
                    type="text"
                    value={formData.result_metric}
                    onChange={(e) => setFormData({ ...formData, result_metric: e.target.value })}
                    placeholder="e.g. 34 viewings booked in 48 hours"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase text-zinc-400 block">
                    Delivery Turnaround (SLA)
                  </label>
                  <input
                    type="text"
                    value={formData.delivery_days}
                    onChange={(e) => setFormData({ ...formData, delivery_days: e.target.value })}
                    placeholder="e.g. 5 days"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase text-zinc-400 block">
                  Project Overview
                </label>
                <textarea
                  rows={2}
                  value={formData.overview}
                  onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                  placeholder="Summary of what was built and business goal..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase text-zinc-400 block">
                    The Problem
                  </label>
                  <textarea
                    rows={2}
                    value={formData.problem}
                    onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                    placeholder="Client's previous operational pain point..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase text-zinc-400 block">
                    The Solution
                  </label>
                  <textarea
                    rows={2}
                    value={formData.solution}
                    onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                    placeholder="What NeuralWaves engineered to solve it..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase text-zinc-400 block">
                  Tech Stack (Comma Separated)
                </label>
                <input
                  type="text"
                  value={formData.tech_stack_raw}
                  onChange={(e) => setFormData({ ...formData, tech_stack_raw: e.target.value })}
                  placeholder="Next.js 14, Meta WhatsApp Cloud API, OpenAI GPT-4o, Supabase"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              {/* ── Project Screenshot / Image (Supabase Storage 'projects') ── */}
              <div className="space-y-2 p-3.5 rounded-xl border border-white/[0.08] bg-white/[0.02]">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-mono uppercase text-zinc-400 flex items-center gap-1.5">
                    <ImageIcon size={13} className="text-violet-400" />
                    Project Screenshot / Cover (Supabase Storage: &apos;projects&apos;)
                  </label>
                  {isUploadingImage && (
                    <span className="text-[10px] font-mono text-violet-400 flex items-center gap-1">
                      <Loader2 size={10} className="animate-spin" /> Uploading to bucket...
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <label className="relative flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg border border-dashed border-white/[0.15] hover:border-violet-500/50 hover:bg-violet-500/[0.05] cursor-pointer text-xs font-mono text-zinc-300 transition-colors">
                    <Upload size={13} className="text-zinc-400" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/svg+xml"
                      onChange={handleImageUpload}
                      disabled={isUploadingImage}
                      className="sr-only"
                    />
                  </label>

                  <div className="flex-1 w-full">
                    <input
                      type="text"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="Or enter direct image URL (https://...)"
                      className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/[0.08] text-[11px] font-mono text-zinc-300 focus:outline-none focus:border-violet-500"
                    />
                  </div>
                </div>

                {formData.image_url && (
                  <div className="relative mt-2 rounded-lg overflow-hidden border border-white/[0.1] bg-black/50 max-h-36 flex items-center justify-center group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={formData.image_url}
                      alt="Project Preview"
                      className="object-contain max-h-32 rounded"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image_url: "" })}
                      className="absolute top-2 right-2 p-1 rounded-md bg-black/80 text-zinc-400 hover:text-white border border-white/[0.1] text-[10px] font-mono flex items-center gap-1"
                    >
                      <X size={10} /> Remove
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="rounded border-white/[0.2] bg-white/[0.05] text-violet-500 focus:ring-0"
                  />
                  <span>Feature on Homepage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
                  <input
                    type="checkbox"
                    checked={formData.is_demo}
                    onChange={(e) => setFormData({ ...formData, is_demo: e.target.checked })}
                    className="rounded border-white/[0.2] bg-white/[0.05] text-violet-500 focus:ring-0"
                  />
                  <span>Interactive Demo Mode</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-glow px-5 py-2.5 rounded-xl text-xs font-semibold text-white flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check size={13} />
                      {editingProject ? "Save Changes" : "Create Project"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
