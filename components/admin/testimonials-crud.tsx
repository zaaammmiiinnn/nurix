"use client";

import React, { useState } from "react";
import {
  Star,
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  Loader2,
  Building,
  Search,
  MessageSquareQuote,
} from "lucide-react";
import { toast } from "sonner";
import {
  type AdminTestimonial,
  createAdminTestimonial,
  updateAdminTestimonial,
  deleteAdminTestimonial,
} from "@/app/admin/testimonials/actions";

interface TestimonialsCrudProps {
  initialTestimonials: AdminTestimonial[];
}

export function TestimonialsCrud({ initialTestimonials }: TestimonialsCrudProps) {
  const [testimonials, setTestimonials] = useState<AdminTestimonial[]>(initialTestimonials);
  const [search, setSearch] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<AdminTestimonial | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    client_name: "",
    client_role: "",
    company: "",
    content: "",
    avatar_url: "",
    rating: 5,
    is_active: true,
    sort_order: 1,
  });

  const resetForm = () => {
    setFormData({
      client_name: "",
      client_role: "",
      company: "",
      content: "",
      avatar_url: "",
      rating: 5,
      is_active: true,
      sort_order: testimonials.length + 1,
    });
    setEditingTestimonial(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: AdminTestimonial) => {
    setEditingTestimonial(t);
    setFormData({
      client_name: t.client_name,
      client_role: t.client_role,
      company: t.company,
      content: t.content,
      avatar_url: t.avatar_url || "",
      rating: t.rating,
      is_active: t.is_active,
      sort_order: t.sort_order,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.client_name || !formData.content) {
      toast.error("Client name and quote content are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingTestimonial && editingTestimonial.id) {
        const res = await updateAdminTestimonial(editingTestimonial.id, {
          client_name: formData.client_name,
          client_role: formData.client_role,
          company: formData.company,
          content: formData.content,
          avatar_url: formData.avatar_url,
          rating: Number(formData.rating),
          is_active: formData.is_active,
          sort_order: Number(formData.sort_order),
        });

        if (res.success) {
          setTestimonials((prev) =>
            prev.map((t) =>
              t.id === editingTestimonial.id
                ? {
                    ...t,
                    ...formData,
                    rating: Number(formData.rating),
                    sort_order: Number(formData.sort_order),
                  }
                : t
            )
          );
          toast.success("Testimonial updated successfully");
          setIsModalOpen(false);
          resetForm();
        } else {
          toast.error(res.message || "Failed to update testimonial");
        }
      } else {
        const res = await createAdminTestimonial({
          client_name: formData.client_name,
          client_role: formData.client_role,
          company: formData.company,
          content: formData.content,
          avatar_url: formData.avatar_url,
          rating: Number(formData.rating),
          is_active: formData.is_active,
          sort_order: Number(formData.sort_order),
        });

        if (res.success && res.testimonial) {
          setTestimonials((prev) => [...prev, res.testimonial!]);
          toast.success("Testimonial created successfully");
          setIsModalOpen(false);
          resetForm();
        } else {
          toast.error(res.message || "Failed to create testimonial");
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
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;

    try {
      const res = await deleteAdminTestimonial(id);
      if (res.success) {
        setTestimonials((prev) => prev.filter((t) => t.id !== id));
        toast.success("Testimonial deleted successfully");
      } else {
        toast.error(res.message || "Failed to delete testimonial");
      }
    } catch {
      toast.error("Failed to delete testimonial");
    }
  };

  const filteredTestimonials = testimonials.filter((t) => {
    const q = search.toLowerCase();
    return (
      t.client_name.toLowerCase().includes(q) ||
      t.company.toLowerCase().includes(q) ||
      t.content.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">
              Social Proof · Client Reviews
            </span>
          </div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Client Testimonials &amp; Quotes
          </h1>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            Quotes displayed on the homepage, case study headers, and trust sections
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="btn-glow px-4 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-2 shadow-lg shadow-violet-500/20"
        >
          <Plus size={14} />
          Add Testimonial
        </button>
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
            placeholder="Search reviews by client, company, or quote text..."
            className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 px-2">
          <span>{filteredTestimonials.length} reviews</span>
        </div>
      </div>

      {/* ── Testimonials Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTestimonials.map((item) => (
          <div
            key={item.id || item.client_name}
            className="rounded-2xl border border-white/[0.08] bg-[#0A0A0F] p-6 flex flex-col justify-between space-y-5 hover:border-white/[0.15] transition-colors relative"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>

                <div className="flex items-center gap-1">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                      item.is_active
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                    }`}
                  >
                    {item.is_active ? "Live" : "Hidden"}
                  </span>
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors ml-1"
                    title="Edit Review"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete Review"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed italic">
                &ldquo;{item.content}&rdquo;
              </p>
            </div>

            <div className="border-t border-white/[0.06] pt-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-xs font-mono font-bold text-violet-400 shrink-0">
                {item.client_name.charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white truncate">
                  {item.client_name}
                </div>
                <div className="text-[11px] text-zinc-400 font-mono truncate">
                  {item.client_role}
                </div>
                <div className="text-[10px] text-zinc-500 font-mono truncate flex items-center gap-1 mt-0.5">
                  <Building size={10} />
                  {item.company}
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredTestimonials.length === 0 && (
          <div className="col-span-full p-12 text-center rounded-2xl border border-white/[0.08] bg-[#0A0A0F] space-y-3">
            <MessageSquareQuote size={28} className="mx-auto text-zinc-600 mb-2" />
            <p className="text-xs font-mono text-zinc-400">No testimonials match search.</p>
            <button
              onClick={handleOpenCreate}
              className="btn-ghost-border px-3.5 py-1.5 rounded-lg text-xs font-mono text-zinc-300 hover:text-white"
            >
              Add first testimonial
            </button>
          </div>
        )}
      </div>

      {/* ── Modal Dialog: Create / Edit ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl border border-white/[0.1] bg-[#0E0E14] p-6 sm:p-8 space-y-6 shadow-2xl relative my-8">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {editingTestimonial ? "Edit Testimonial" : "New Client Review"}
                </h3>
                <p className="text-xs font-mono text-zinc-400">
                  {editingTestimonial
                    ? `Updating quote from ${editingTestimonial.client_name}`
                    : "Add verified client social proof"}
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
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.client_name}
                    onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                    placeholder="e.g. Tariq Mansour"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase text-zinc-400 block">
                    Client Title / Role
                  </label>
                  <input
                    type="text"
                    value={formData.client_role}
                    onChange={(e) => setFormData({ ...formData, client_role: e.target.value })}
                    placeholder="e.g. Managing Director"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase text-zinc-400 block">
                  Company / Location
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="e.g. Gulf Skyline Real Estate, Dubai"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase text-zinc-400 block">
                  Quote Text *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="What the client said about the results and delivery..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase text-zinc-400 block">
                    Star Rating (1–5)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase text-zinc-400 block">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="rounded border-white/[0.2] bg-white/[0.05] text-violet-500 focus:ring-0"
                  />
                  <span>Active &amp; Displayed on Site</span>
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
                      {editingTestimonial ? "Save Changes" : "Create Review"}
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
