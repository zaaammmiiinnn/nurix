"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Download,
  Trash2,
  X,
  Phone,
  Mail,
  Save,
  MessageCircle,
  Plus,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import {
  type Lead,
  updateLeadStatus,
  bulkUpdateLeads,
  bulkDeleteLeads,
  createManualLead,
} from "@/app/admin/leads/actions";

interface LeadsTableProps {
  initialLeads: Lead[];
  initialSelectedId?: string;
  initialOpenCreate?: boolean;
}

export function LeadsTable({
  initialLeads,
  initialSelectedId,
  initialOpenCreate = false,
}: LeadsTableProps) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Drawer detail state
  const [activeLead, setActiveLead] = useState<Lead | null>(() => {
    if (initialSelectedId) {
      return initialLeads.find((l) => l.id === initialSelectedId) || null;
    }
    return null;
  });

  const [drawerStatus, setDrawerStatus] = useState<Lead["status"]>("new");
  const [drawerNotes, setDrawerNotes] = useState("");
  const [savingDrawer, setSavingDrawer] = useState(false);

  // Manual create dialog state
  const [createOpen, setCreateOpen] = useState(initialOpenCreate);
  const [newLeadName, setNewLeadName] = useState("");
  const [newLeadEmail, setNewLeadEmail] = useState("");
  const [newLeadPhone, setNewLeadPhone] = useState("");
  const [newLeadCompany, setNewLeadCompany] = useState("");
  const [newLeadService, setNewLeadService] = useState("chatbots");
  const [newLeadMessage, setNewLeadMessage] = useState("");
  const [creating, setCreating] = useState(false);

  // When active lead is selected, sync drawer fields
  const handleOpenLead = (lead: Lead) => {
    setActiveLead(lead);
    setDrawerStatus(lead.status);
    setDrawerNotes(lead.notes || "");
  };

  const handleCloseDrawer = () => {
    setActiveLead(null);
  };

  // Filter leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesStatus =
        statusFilter === "all" ? true : lead.status === statusFilter;
      const q = search.toLowerCase();
      const matchesSearch =
        lead.name.toLowerCase().includes(q) ||
        lead.email.toLowerCase().includes(q) ||
        (lead.company && lead.company.toLowerCase().includes(q)) ||
        lead.phone.includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [leads, statusFilter, search]);

  // Bulk selection handlers
  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredLeads.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredLeads.map((l) => l.id));
    }
  };

  const handleToggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Save drawer notes and status
  const handleSaveDrawer = async () => {
    if (!activeLead) return;
    setSavingDrawer(true);
    try {
      await updateLeadStatus(activeLead.id, drawerStatus, drawerNotes);
      setLeads((prev) =>
        prev.map((l) =>
          l.id === activeLead.id
            ? { ...l, status: drawerStatus, notes: drawerNotes }
            : l
        )
      );
      setActiveLead((prev) =>
        prev ? { ...prev, status: drawerStatus, notes: drawerNotes } : null
      );
      toast.success("Lead updated successfully");
    } catch {
      toast.error("Failed to update lead");
    } finally {
      setSavingDrawer(false);
    }
  };

  // Bulk actions
  const handleBulkStatus = async (status: Lead["status"]) => {
    if (selectedIds.length === 0) return;
    try {
      await bulkUpdateLeads(selectedIds, status);
      setLeads((prev) =>
        prev.map((l) => (selectedIds.includes(l.id) ? { ...l, status } : l))
      );
      setSelectedIds([]);
      toast.success(`Updated ${selectedIds.length} lead(s) to ${status}`);
    } catch {
      toast.error("Failed to update leads");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (
      !confirm(
        `Are you sure you want to permanently delete ${selectedIds.length} lead(s)?`
      )
    ) {
      return;
    }
    try {
      await bulkDeleteLeads(selectedIds);
      setLeads((prev) => prev.filter((l) => !selectedIds.includes(l.id)));
      if (activeLead && selectedIds.includes(activeLead.id)) {
        setActiveLead(null);
      }
      setSelectedIds([]);
      toast.success(`Deleted ${selectedIds.length} lead(s)`);
    } catch {
      toast.error("Failed to delete leads");
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Name",
      "Email",
      "Phone",
      "Company",
      "Service",
      "Status",
      "Message",
      "Notes",
      "Created At",
    ];
    const rows = filteredLeads.map((l) => [
      l.id,
      `"${l.name.replace(/"/g, '""')}"`,
      l.email,
      l.phone,
      `"${(l.company || "").replace(/"/g, '""')}"`,
      l.service,
      l.status,
      `"${(l.message || "").replace(/"/g, '""')}"`,
      `"${(l.notes || "").replace(/"/g, '""')}"`,
      l.created_at,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `nurix-leads-${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Leads exported to CSV");
  };

  // Manual create lead
  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await createManualLead({
        name: newLeadName,
        email: newLeadEmail,
        phone: newLeadPhone,
        company: newLeadCompany || null,
        service: newLeadService,
        message: newLeadMessage,
        status: "new",
        notes: null,
      });

      if (res.success && res.lead) {
        setLeads((prev) => [res.lead, ...prev]);
        setCreateOpen(false);
        setNewLeadName("");
        setNewLeadEmail("");
        setNewLeadPhone("");
        setNewLeadCompany("");
        setNewLeadMessage("");
        toast.success("Lead created manually");
      }
    } catch {
      toast.error("Failed to create lead");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6 select-none relative">
      {/* ── Top Bar: Search, Filters & Actions ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto p-1 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-mono">
          {["all", "new", "contacted", "won", "lost"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                statusFilter === st
                  ? "bg-violet-600/30 text-white border border-violet-500/40 font-medium"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search input + Buttons */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search leads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/60"
            />
          </div>

          <button
            onClick={handleExportCSV}
            title="Export CSV"
            className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-zinc-400 hover:text-white hover:border-violet-500/30 transition-colors"
          >
            <Download size={15} />
          </button>

          <button
            onClick={() => setCreateOpen(true)}
            className="btn-glow px-3 py-1.5 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5"
          >
            <Plus size={14} />
            Add Lead
          </button>
        </div>
      </div>

      {/* ── Bulk Actions Bar ── */}
      {selectedIds.length > 0 && (
        <div className="p-3 rounded-xl bg-violet-950/40 border border-violet-500/30 flex items-center justify-between text-xs font-mono text-zinc-300">
          <span>{selectedIds.length} lead(s) selected</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkStatus("contacted")}
              className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20"
            >
              Mark Contacted
            </button>
            <button
              onClick={() => handleBulkStatus("won")}
              className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20"
            >
              Mark Won
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 flex items-center gap-1"
            >
              <Trash2 size={12} /> Delete
            </button>
          </div>
        </div>
      )}

      {/* ── Data Table ── */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0A0A0F] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.06] text-zinc-500 font-mono text-[10px] uppercase tracking-wider bg-white/[0.01]">
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={
                      filteredLeads.length > 0 &&
                      selectedIds.length === filteredLeads.length
                    }
                    onChange={handleToggleSelectAll}
                    className="rounded bg-black/40 border-white/20 accent-violet-600"
                  />
                </th>
                <th className="py-3 px-4">Name / Contact</th>
                <th className="py-3 px-4">Company</th>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Received</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500 font-mono">
                    No leads found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const isSelected = selectedIds.includes(lead.id);
                  const statusStyles = {
                    new: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
                    contacted: "bg-amber-500/10 text-amber-400 border-amber-500/30",
                    won: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
                    lost: "bg-rose-500/10 text-rose-400 border-rose-500/30",
                    archived: "bg-zinc-500/10 text-zinc-400 border-zinc-500/30",
                  };

                  return (
                    <tr
                      key={lead.id}
                      onClick={() => handleOpenLead(lead)}
                      className={`hover:bg-white/[0.02] cursor-pointer transition-colors ${
                        activeLead?.id === lead.id ? "bg-violet-600/10" : ""
                      }`}
                    >
                      <td
                        className="py-3 px-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectRow(lead.id)}
                          className="rounded bg-black/40 border-white/20 accent-violet-600"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-white">{lead.name}</div>
                        <div className="text-[11px] text-zinc-500 font-mono flex items-center gap-2 mt-0.5">
                          <span>{lead.email}</span>
                          <span>•</span>
                          <span>{lead.phone}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-zinc-400 font-mono">
                        {lead.company || "—"}
                      </td>
                      <td className="py-3 px-4 font-mono text-zinc-300 capitalize">
                        {lead.service}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full border text-[10px] font-mono uppercase tracking-wider ${
                            statusStyles[lead.status]
                          }`}
                        >
                          {lead.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-zinc-500 text-[11px]">
                        {new Date(lead.created_at).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                        })}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Slide-Over Detail Drawer ── */}
      {activeLead && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-[#0E0E14] border-l border-white/[0.08] shadow-2xl z-50 flex flex-col justify-between p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-violet-400">
                  Lead Details
                </span>
                <h3 className="text-xl font-medium text-white mt-0.5">
                  {activeLead.name}
                </h3>
              </div>
              <button
                onClick={handleCloseDrawer}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.05]"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Actions (Call / WhatsApp / Email) */}
            <div className="grid grid-cols-3 gap-2">
              <a
                href={`https://wa.me/${activeLead.phone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono hover:bg-emerald-500/20"
              >
                <MessageCircle size={14} /> WhatsApp
              </a>
              <a
                href={`mailto:${activeLead.email}`}
                className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-mono hover:bg-violet-500/20"
              >
                <Mail size={14} /> Email
              </a>
              <a
                href={`tel:${activeLead.phone}`}
                className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-white/[0.05] border border-white/[0.1] text-zinc-300 text-xs font-mono hover:bg-white/[0.1]"
              >
                <Phone size={14} /> Call
              </a>
            </div>

            {/* Contact Specs */}
            <div className="space-y-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs font-mono space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-500">Service:</span>
                <span className="text-white capitalize">{activeLead.service}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Company:</span>
                <span className="text-white">{activeLead.company || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Submitted:</span>
                <span className="text-zinc-400">
                  {new Date(activeLead.created_at).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Project Message */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                Inbound Message
              </label>
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs text-zinc-300 leading-relaxed max-h-36 overflow-y-auto whitespace-pre-wrap">
                {activeLead.message}
              </div>
            </div>

            {/* Status Dropdown */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                Lead Status
              </label>
              <select
                value={drawerStatus}
                onChange={(e) =>
                  setDrawerStatus(e.target.value as Lead["status"])
                }
                className="w-full px-3 py-2.5 rounded-xl bg-[#07070A] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-violet-500"
              >
                <option value="new">New (Needs Response)</option>
                <option value="contacted">Contacted (In Discussion)</option>
                <option value="won">Won (Deal Closed / Signed)</option>
                <option value="lost">Lost (Did Not Close)</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* Internal Notes Textarea */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                Internal Ops Notes
              </label>
              <textarea
                rows={4}
                placeholder="Log call outcome, scope estimate, agreed rate in AED, next follow-up date..."
                value={drawerNotes}
                onChange={(e) => setDrawerNotes(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#07070A] border border-white/[0.08] text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 resize-none font-mono"
              />
            </div>
          </div>

          {/* Drawer Footer Save Button */}
          <div className="pt-4 border-t border-white/[0.08] flex items-center justify-end gap-3">
            <button
              onClick={handleCloseDrawer}
              className="px-4 py-2 rounded-xl text-xs font-mono text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveDrawer}
              disabled={savingDrawer}
              className="btn-glow px-5 py-2.5 rounded-xl text-xs font-semibold text-white flex items-center gap-2"
            >
              {savingDrawer ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Save size={14} />
              )}
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* ── Add Lead Manually Dialog Modal ── */}
      {createOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl border border-white/[0.08] bg-[#0E0E14] p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h3 className="text-base font-semibold text-white">
                Create Inbound Lead Manually
              </h3>
              <button
                onClick={() => setCreateOpen(false)}
                className="text-zinc-500 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-zinc-400">Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Sultan Al Dhaheri"
                    value={newLeadName}
                    onChange={(e) => setNewLeadName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black border border-white/[0.08] text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-400">Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="sultan@group.ae"
                    value={newLeadEmail}
                    onChange={(e) => setNewLeadEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black border border-white/[0.08] text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-zinc-400">Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+971 50 123 4567"
                    value={newLeadPhone}
                    onChange={(e) => setNewLeadPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black border border-white/[0.08] text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-400">Company</label>
                  <input
                    type="text"
                    placeholder="Al Dhaheri Holdings"
                    value={newLeadCompany}
                    onChange={(e) => setNewLeadCompany(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black border border-white/[0.08] text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400">Service Offering</label>
                <select
                  value={newLeadService}
                  onChange={(e) => setNewLeadService(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black border border-white/[0.08] text-white focus:outline-none focus:border-violet-500"
                >
                  <option value="chatbots">AI Chatbots & WhatsApp Automation</option>
                  <option value="dashboards">Web & Admin Dashboard</option>
                  <option value="agents">AI Agents for Business</option>
                  <option value="custom">Custom Automation</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400">Scope / Notes *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Details discussed during phone or meeting..."
                  value={newLeadMessage}
                  onChange={(e) => setNewLeadMessage(e.target.value)}
                  className="w-full p-3 rounded-lg bg-black border border-white/[0.08] text-white focus:outline-none focus:border-violet-500 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCreateOpen(false)}
                  className="px-4 py-2 text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="btn-glow px-5 py-2 rounded-xl text-white font-semibold flex items-center gap-1.5"
                >
                  {creating && <Loader2 size={13} className="animate-spin" />}
                  Create Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
