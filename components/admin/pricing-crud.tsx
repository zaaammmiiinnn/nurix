"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ExternalLink,
  Plus,
  Clock,
  Edit2,
  Trash2,
  X,
  Check,
  Loader2,
  CheckCircle2,
  Search,
  DollarSign,
} from "lucide-react";
import { toast } from "sonner";
import {
  type AdminPricingTier,
  createAdminPricingTier,
  updateAdminPricingTier,
  deleteAdminPricingTier,
} from "@/app/admin/pricing/actions";

interface PricingCrudProps {
  initialTiers: AdminPricingTier[];
}

export function PricingCrud({ initialTiers }: PricingCrudProps) {
  const [tiers, setTiers] = useState<AdminPricingTier[]>(initialTiers);
  const [search, setSearch] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<AdminPricingTier | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    price_numeric: 0,
    description: "",
    delivery_timeframe: "5–7 business days",
    features_raw: "",
    cta_label: "Get started",
    is_featured: false,
    sort_order: 1,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      price_numeric: 0,
      description: "",
      delivery_timeframe: "5–7 business days",
      features_raw: "",
      cta_label: "Get started",
      is_featured: false,
      sort_order: tiers.length + 1,
    });
    setEditingTier(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tier: AdminPricingTier) => {
    setEditingTier(tier);
    setFormData({
      name: tier.name,
      price: tier.price,
      price_numeric: tier.price_numeric || 0,
      description: tier.description,
      delivery_timeframe: tier.delivery_timeframe,
      features_raw: (tier.features || []).join("\n"),
      cta_label: tier.cta_label || "Get started",
      is_featured: tier.is_featured,
      sort_order: tier.sort_order,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      toast.error("Package name and price are required.");
      return;
    }

    setIsSubmitting(true);
    const features = formData.features_raw
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    try {
      if (editingTier && editingTier.id) {
        const res = await updateAdminPricingTier(editingTier.id, {
          name: formData.name,
          price: formData.price,
          price_numeric: Number(formData.price_numeric),
          description: formData.description,
          delivery_timeframe: formData.delivery_timeframe,
          features,
          cta_label: formData.cta_label,
          is_featured: formData.is_featured,
          sort_order: Number(formData.sort_order),
        });

        if (res.success) {
          setTiers((prev) =>
            prev.map((t) =>
              t.id === editingTier.id
                ? {
                    ...t,
                    ...formData,
                    features,
                    sort_order: Number(formData.sort_order),
                    price_numeric: Number(formData.price_numeric),
                  }
                : t
            )
          );
          toast.success("Pricing tier updated successfully");
          setIsModalOpen(false);
          resetForm();
        } else {
          toast.error(res.message || "Failed to update pricing tier");
        }
      } else {
        const res = await createAdminPricingTier({
          name: formData.name,
          price: formData.price,
          price_numeric: Number(formData.price_numeric),
          description: formData.description,
          delivery_timeframe: formData.delivery_timeframe,
          features,
          cta_label: formData.cta_label,
          is_featured: formData.is_featured,
          sort_order: Number(formData.sort_order),
        });

        if (res.success && res.tier) {
          setTiers((prev) => [...prev, res.tier!]);
          toast.success("Pricing tier created successfully");
          setIsModalOpen(false);
          resetForm();
        } else {
          toast.error(res.message || "Failed to create pricing tier");
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
    if (!window.confirm("Are you sure you want to delete this pricing tier?")) return;

    try {
      const res = await deleteAdminPricingTier(id);
      if (res.success) {
        setTiers((prev) => prev.filter((t) => t.id !== id));
        toast.success("Pricing tier deleted successfully");
      } else {
        toast.error(res.message || "Failed to delete pricing tier");
      }
    } catch {
      toast.error("Failed to delete pricing tier");
    }
  };

  const filteredTiers = tiers.filter((t) => {
    const q = search.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      t.price.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">
              Commercial · Pricing Architecture
            </span>
          </div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Fixed Pricing Tiers (AED)
          </h1>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            Manage packages, price points, turnaround SLAs, and included features
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/pricing"
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
            Add Package Tier
          </button>
        </div>
      </div>

      {/* ── Search Bar ── */}
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
            placeholder="Search tiers by package name or details..."
            className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 px-2">
          <span>{filteredTiers.length} tier packages</span>
        </div>
      </div>

      {/* ── Tiers Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTiers.map((tier) => (
          <div
            key={tier.id || tier.name}
            className={`rounded-2xl border p-6 flex flex-col justify-between space-y-6 relative transition-all ${
              tier.is_featured
                ? "border-violet-500/40 bg-gradient-to-b from-violet-500/[0.08] to-transparent shadow-[0_0_30px_rgba(139,92,246,0.1)]"
                : "border-white/[0.08] bg-[#0A0A0F] hover:border-white/[0.15]"
            }`}
          >
            {tier.is_featured && (
              <div className="absolute -top-3 right-6 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-violet-500 text-white shadow-md flex items-center gap-1">
                <Sparkles size={10} /> Most Popular
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-xs uppercase tracking-wider text-zinc-400 block mb-1">
                    Tier Package
                  </span>
                  <h3 className="text-xl font-bold text-white tracking-tight">{tier.name}</h3>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(tier)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                    title="Edit Tier"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(tier.id)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete Tier"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              <p className="text-xs text-zinc-400 min-h-[32px]">{tier.description}</p>

              <div className="border-t border-b border-white/[0.06] py-4 space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-mono font-bold text-white">{tier.price}</span>
                  <span className="text-[11px] font-mono text-zinc-400">fixed fee</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
                  <Clock size={12} />
                  <span>{tier.delivery_timeframe} turnaround</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase text-zinc-500 block">
                  Included Features ({tier.features.length})
                </span>
                <ul className="space-y-2">
                  {tier.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2 text-xs text-zinc-300">
                      <CheckCircle2 size={13} className="text-violet-400 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-zinc-500">
              <span>CTA: {tier.cta_label}</span>
              <span>Order #{tier.sort_order}</span>
            </div>
          </div>
        ))}

        {filteredTiers.length === 0 && (
          <div className="col-span-full p-12 text-center rounded-2xl border border-white/[0.08] bg-[#0A0A0F] space-y-3">
            <DollarSign size={28} className="mx-auto text-zinc-600 mb-2" />
            <p className="text-xs font-mono text-zinc-400">No pricing tiers match search.</p>
            <button
              onClick={handleOpenCreate}
              className="btn-ghost-border px-3.5 py-1.5 rounded-lg text-xs font-mono text-zinc-300 hover:text-white"
            >
              Add first package
            </button>
          </div>
        )}
      </div>

      {/* ── Modal Dialog: Create / Edit ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl rounded-2xl border border-white/[0.1] bg-[#0E0E14] p-6 sm:p-8 space-y-6 shadow-2xl relative my-8">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {editingTier ? "Edit Pricing Tier" : "New Pricing Package"}
                </h3>
                <p className="text-xs font-mono text-zinc-400">
                  {editingTier
                    ? `Updating ${editingTier.name} package`
                    : "Add new package to public pricing table"}
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
                    Package Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Starter Automations"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase text-zinc-400 block">
                    Price String *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g. 12,000 AED"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase text-zinc-400 block">
                    Numeric Price (AED)
                  </label>
                  <input
                    type="number"
                    value={formData.price_numeric}
                    onChange={(e) => setFormData({ ...formData, price_numeric: Number(e.target.value) })}
                    placeholder="12000"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase text-zinc-400 block">
                    Delivery Turnaround
                  </label>
                  <input
                    type="text"
                    value={formData.delivery_timeframe}
                    onChange={(e) =>
                      setFormData({ ...formData, delivery_timeframe: e.target.value })
                    }
                    placeholder="e.g. 5–7 business days"
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

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase text-zinc-400 block">
                  Package Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Target audience and problem solved..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase text-zinc-400 block">
                  CTA Button Label
                </label>
                <input
                  type="text"
                  value={formData.cta_label}
                  onChange={(e) => setFormData({ ...formData, cta_label: e.target.value })}
                  placeholder="e.g. Book Consultation"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase text-zinc-400 block">
                  Features List (One Per Line)
                </label>
                <textarea
                  rows={4}
                  value={formData.features_raw}
                  onChange={(e) => setFormData({ ...formData, features_raw: e.target.value })}
                  placeholder="Single dedicated AI agent workflow&#10;WhatsApp or Web widget integration&#10;CRM sync via webhooks&#10;14-day post-launch warranty"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white font-mono focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="rounded border-white/[0.2] bg-white/[0.05] text-violet-500 focus:ring-0"
                  />
                  <span>Highlight as &apos;Most Popular&apos; Tier</span>
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
                      {editingTier ? "Save Changes" : "Create Package"}
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
