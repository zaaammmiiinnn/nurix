"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Cpu,
  ExternalLink,
  Plus,
  Clock,
  Edit2,
  Trash2,
  X,
  Check,
  Loader2,
  Search,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import {
  type AdminService,
  createAdminService,
  updateAdminService,
  deleteAdminService,
} from "@/app/admin/services/actions";

interface ServicesCrudProps {
  initialServices: AdminService[];
}

export function ServicesCrud({ initialServices }: ServicesCrudProps) {
  const [services, setServices] = useState<AdminService[]>(initialServices);
  const [search, setSearch] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<AdminService | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    tagline: "",
    description: "",
    features_raw: "",
    pricing: "From 12,000 AED",
    delivery_days: "5–7 business days",
    sort_order: 1,
    is_active: true,
  });

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      tagline: "",
      description: "",
      features_raw: "",
      pricing: "From 12,000 AED",
      delivery_days: "5–7 business days",
      sort_order: services.length + 1,
      is_active: true,
    });
    setEditingService(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (service: AdminService) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      slug: service.slug,
      tagline: service.tagline,
      description: service.description,
      features_raw: (service.features || []).join("\n"),
      pricing: service.pricing,
      delivery_days: service.delivery_days,
      sort_order: service.sort_order,
      is_active: service.is_active,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.slug) {
      toast.error("Title and slug are required.");
      return;
    }

    setIsSubmitting(true);
    const features = formData.features_raw
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    try {
      if (editingService && editingService.id) {
        const res = await updateAdminService(editingService.id, {
          title: formData.title,
          slug: formData.slug,
          tagline: formData.tagline,
          description: formData.description,
          features,
          pricing: formData.pricing,
          delivery_days: formData.delivery_days,
          sort_order: Number(formData.sort_order),
          is_active: formData.is_active,
        });

        if (res.success) {
          setServices((prev) =>
            prev.map((s) =>
              s.id === editingService.id
                ? {
                    ...s,
                    ...formData,
                    features,
                    sort_order: Number(formData.sort_order),
                  }
                : s
            )
          );
          toast.success("Service updated successfully");
          setIsModalOpen(false);
          resetForm();
        } else {
          toast.error(res.message || "Failed to update service");
        }
      } else {
        const res = await createAdminService({
          title: formData.title,
          slug: formData.slug,
          tagline: formData.tagline,
          description: formData.description,
          features,
          pricing: formData.pricing,
          delivery_days: formData.delivery_days,
          sort_order: Number(formData.sort_order),
          is_active: formData.is_active,
        });

        if (res.success && res.service) {
          setServices((prev) => [...prev, res.service!]);
          toast.success("Service created successfully");
          setIsModalOpen(false);
          resetForm();
        } else {
          toast.error(res.message || "Failed to create service");
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
    if (!window.confirm("Are you sure you want to delete this service?")) return;

    try {
      const res = await deleteAdminService(id);
      if (res.success) {
        setServices((prev) => prev.filter((s) => s.id !== id));
        toast.success("Service deleted successfully");
      } else {
        toast.error(res.message || "Failed to delete service");
      }
    } catch {
      toast.error("Failed to delete service");
    }
  };

  const filteredServices = services.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.title.toLowerCase().includes(q) ||
      s.slug.toLowerCase().includes(q) ||
      s.tagline.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">
              Services · Database CRUD
            </span>
          </div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Services &amp; Capabilities
          </h1>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            Manage public studio offerings, deliverables scope, and fixed pricing tiers
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/services"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost-border px-3 py-2 rounded-xl text-xs font-mono text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink size={13} className="text-zinc-400" />
            Public Page
          </Link>
          <button
            onClick={handleOpenCreate}
            className="btn-glow px-4 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-2 shadow-lg shadow-violet-500/20"
          >
            <Plus size={14} />
            Add Service
          </button>
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-2xl border border-white/[0.08] bg-[#0A0A0F]">
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services by title, slug, or keywords..."
            className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 px-2">
          <span>{filteredServices.length} offerings</span>
        </div>
      </div>

      {/* ── Services Cards List ── */}
      <div className="grid grid-cols-1 gap-5">
        {filteredServices.map((service, idx) => (
          <div
            key={service.id || service.slug}
            className="rounded-2xl border border-white/[0.08] bg-[#0A0A0F] p-6 space-y-5 hover:border-white/[0.15] transition-colors relative group"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0 font-mono font-bold text-sm">
                  {service.number || `0${idx + 1}`}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-zinc-500">
                      /services/{service.slug}
                    </span>
                    <span className="text-zinc-700">·</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                        service.is_active
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                      }`}
                    >
                      {service.is_active ? "Active" : "Draft / Inactive"}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white tracking-tight">
                    {service.title}
                  </h3>
                  <p className="text-xs text-zinc-400 font-mono">{service.tagline}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-base font-mono font-bold text-white block">
                    {service.pricing}
                  </span>
                  <span className="text-[11px] font-mono text-zinc-500 flex items-center justify-end gap-1">
                    <Clock size={11} /> {service.delivery_days}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 ml-2">
                  <Link
                    href={`/services/${service.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.04] transition-colors"
                    title="View public page"
                  >
                    <ExternalLink size={14} />
                  </Link>
                  <button
                    onClick={() => handleOpenEdit(service)}
                    className="p-2 rounded-lg text-zinc-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                    title="Edit Service"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="p-2 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete Service"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t border-white/[0.06] pt-4 space-y-3">
              <p className="text-xs text-zinc-300 leading-relaxed max-w-3xl">
                {service.description}
              </p>

              {service.features && service.features.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                    Included Deliverables ({service.features.length})
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {service.features.map((feat, fIdx) => (
                      <div
                        key={fIdx}
                        className="flex items-center gap-2 text-xs text-zinc-400"
                      >
                        <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredServices.length === 0 && (
          <div className="p-12 text-center rounded-2xl border border-white/[0.08] bg-[#0A0A0F] space-y-3">
            <Cpu size={28} className="mx-auto text-zinc-600 mb-2" />
            <p className="text-xs font-mono text-zinc-400">No services found.</p>
            <button
              onClick={handleOpenCreate}
              className="btn-ghost-border px-3.5 py-1.5 rounded-lg text-xs font-mono text-zinc-300 hover:text-white"
            >
              Add first service
            </button>
          </div>
        )}
      </div>

      {/* ── Modal Dialog: Create / Edit ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl border border-white/[0.1] bg-[#0E0E14] p-6 sm:p-8 space-y-6 shadow-2xl relative my-8">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {editingService ? "Edit Service" : "New Studio Offering"}
                </h3>
                <p className="text-xs font-mono text-zinc-400">
                  {editingService
                    ? `Updating /services/${editingService.slug}`
                    : "Add service to the public site and database"}
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
                    Service Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. AI Customer Concierge"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase text-zinc-400 block">
                    Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. chatbots"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase text-zinc-400 block">
                  Tagline / Short Pitch
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="e.g. Autonomous 24/7 lead qualification & booking"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase text-zinc-400 block">
                    Starting Price
                  </label>
                  <input
                    type="text"
                    value={formData.pricing}
                    onChange={(e) => setFormData({ ...formData, pricing: e.target.value })}
                    placeholder="e.g. From 12,000 AED"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase text-zinc-400 block">
                    Delivery SLA
                  </label>
                  <input
                    type="text"
                    value={formData.delivery_days}
                    onChange={(e) => setFormData({ ...formData, delivery_days: e.target.value })}
                    placeholder="e.g. 5–7 business days"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase text-zinc-400 block">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase text-zinc-400 block">
                  Detailed Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Overview of this offering..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase text-zinc-400 block">
                  Deliverables Scope (One Per Line)
                </label>
                <textarea
                  rows={4}
                  value={formData.features_raw}
                  onChange={(e) => setFormData({ ...formData, features_raw: e.target.value })}
                  placeholder="Custom LLM fine-tuning&#10;WhatsApp Business Cloud API webhook&#10;Multi-lingual Arabic & English fallback&#10;Live human handoff trigger"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white font-mono focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="rounded border-white/[0.2] bg-white/[0.05] text-violet-500 focus:ring-0"
                  />
                  <span>Active &amp; Visible to Public</span>
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
                      {editingService ? "Save Changes" : "Create Service"}
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
