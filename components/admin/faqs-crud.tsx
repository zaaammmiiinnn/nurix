"use client";

import React, { useState } from "react";
import {
  HelpCircle,
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  Loader2,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import {
  type AdminFaq,
  createAdminFaq,
  updateAdminFaq,
  deleteAdminFaq,
} from "@/app/admin/faqs/actions";

interface FaqsCrudProps {
  initialFaqs: AdminFaq[];
}

export function FaqsCrud({ initialFaqs }: FaqsCrudProps) {
  const [faqs, setFaqs] = useState<AdminFaq[]>(initialFaqs);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<AdminFaq | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "general",
    sort_order: 1,
    is_active: true,
  });

  const resetForm = () => {
    setFormData({
      question: "",
      answer: "",
      category: "general",
      sort_order: faqs.length + 1,
      is_active: true,
    });
    setEditingFaq(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (faq: AdminFaq) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      sort_order: faq.sort_order,
      is_active: faq.is_active,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question || !formData.answer) {
      toast.error("Question and answer are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingFaq && editingFaq.id) {
        const res = await updateAdminFaq(editingFaq.id, {
          question: formData.question,
          answer: formData.answer,
          category: formData.category,
          sort_order: Number(formData.sort_order),
          is_active: formData.is_active,
        });

        if (res.success) {
          setFaqs((prev) =>
            prev.map((f) =>
              f.id === editingFaq.id
                ? {
                    ...f,
                    ...formData,
                    sort_order: Number(formData.sort_order),
                  }
                : f
            )
          );
          toast.success("FAQ updated successfully");
          setIsModalOpen(false);
          resetForm();
        } else {
          toast.error(res.message || "Failed to update FAQ");
        }
      } else {
        const res = await createAdminFaq({
          question: formData.question,
          answer: formData.answer,
          category: formData.category,
          sort_order: Number(formData.sort_order),
          is_active: formData.is_active,
        });

        if (res.success && res.faq) {
          setFaqs((prev) => [...prev, res.faq!]);
          toast.success("FAQ created successfully");
          setIsModalOpen(false);
          resetForm();
        } else {
          toast.error(res.message || "Failed to create FAQ");
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
    if (!window.confirm("Are you sure you want to delete this FAQ?")) return;

    try {
      const res = await deleteAdminFaq(id);
      if (res.success) {
        setFaqs((prev) => prev.filter((f) => f.id !== id));
        toast.success("FAQ deleted successfully");
      } else {
        toast.error(res.message || "Failed to delete FAQ");
      }
    } catch {
      toast.error("Failed to delete FAQ");
    }
  };

  const categories = ["all", "general", "pricing", "technical"];

  const filteredFaqs = faqs.filter((f) => {
    const q = search.toLowerCase();
    const matchesSearch =
      f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q);
    const matchesCategory =
      categoryFilter === "all" ||
      f.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-violet-400" />
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">
              Content · Frequently Asked Questions
            </span>
          </div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            FAQs &amp; Objection Handling
          </h1>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            Standard studio answers for fixed pricing, delivery timeframes, and IP ownership
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="btn-glow px-4 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-2 shadow-lg shadow-violet-500/20"
        >
          <Plus size={14} />
          Add Question
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
            placeholder="Search FAQs by question or answer keywords..."
            className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono uppercase transition-all shrink-0 ${
                categoryFilter === cat
                  ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                  : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── FAQs List ── */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0A0A0F] overflow-hidden">
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle size={16} className="text-violet-400" />
            <h2 className="text-sm font-semibold text-white">Live FAQ Items</h2>
          </div>
          <span className="font-mono text-xs text-zinc-500">
            {filteredFaqs.length} questions listed
          </span>
        </div>

        <div className="divide-y divide-white/[0.06]">
          {filteredFaqs.map((faq, index) => (
            <div
              key={faq.id || index}
              className="p-6 hover:bg-white/[0.01] transition-colors space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="font-mono text-xs text-violet-400 shrink-0 mt-0.5">
                    {String(faq.sort_order || index + 1).padStart(2, "0")}
                  </span>
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-white tracking-tight">
                      {faq.question}
                    </h3>
                    <div className="flex items-center gap-2 pt-0.5">
                      <span className="px-2 py-0.2 rounded text-[10px] font-mono uppercase tracking-wider bg-white/[0.04] text-zinc-400 border border-white/[0.08]">
                        {faq.category}
                      </span>
                      <span
                        className={`px-2 py-0.2 rounded text-[10px] font-mono uppercase ${
                          faq.is_active
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                        }`}
                      >
                        {faq.is_active ? "Live" : "Draft"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleOpenEdit(faq)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                    title="Edit FAQ"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(faq.id)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete FAQ"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed pl-7">
                {faq.answer}
              </p>
            </div>
          ))}

          {filteredFaqs.length === 0 && (
            <div className="p-12 text-center space-y-3">
              <HelpCircle size={28} className="mx-auto text-zinc-600 mb-2" />
              <p className="text-xs font-mono text-zinc-400">No questions match filter.</p>
              <button
                onClick={handleOpenCreate}
                className="btn-ghost-border px-3.5 py-1.5 rounded-lg text-xs font-mono text-zinc-300 hover:text-white"
              >
                Add first question
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Modal Dialog: Create / Edit ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl rounded-2xl border border-white/[0.1] bg-[#0E0E14] p-6 sm:p-8 space-y-6 shadow-2xl relative my-8">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {editingFaq ? "Edit FAQ" : "New Question"}
                </h3>
                <p className="text-xs font-mono text-zinc-400">
                  {editingFaq
                    ? "Update question and studio response"
                    : "Add question to FAQ accordions"}
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
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase text-zinc-400 block">
                  Question *
                </label>
                <input
                  type="text"
                  required
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="e.g. Do I own 100% of the code and intellectual property?"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase text-zinc-400 block">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="general" className="bg-[#0E0E14]">General</option>
                    <option value="pricing" className="bg-[#0E0E14]">Pricing &amp; Billing</option>
                    <option value="technical" className="bg-[#0E0E14]">Technical &amp; Integrations</option>
                  </select>
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

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase text-zinc-400 block">
                  Answer *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  placeholder="Comprehensive studio answer..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-violet-500"
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
                  <span>Visible in Public FAQ Section</span>
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
                      {editingFaq ? "Save Changes" : "Create FAQ"}
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
