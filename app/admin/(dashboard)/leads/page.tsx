import React from "react";
import { getLeads } from "@/app/admin/leads/actions";
import { LeadsTable } from "@/components/admin/leads-table";

export const metadata = {
  title: "Leads Pipeline | Nurix Admin",
  description: "Track inbound inquiries, client discussions, and project status.",
};

interface LeadsPageProps {
  searchParams: Promise<{
    id?: string;
    new?: string;
  }>;
}

export default async function AdminLeadsPage({ searchParams }: LeadsPageProps) {
  const params = await searchParams;
  const leads = await getLeads();

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs uppercase tracking-wider text-violet-400">
              Pipeline Management
            </span>
            <span className="text-white/20">•</span>
            <span className="text-xs text-white/50">{leads.length} total entries</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Inbound Leads</h1>
          <p className="text-sm text-white/50 mt-1">
            Qualify incoming client briefs, update status, record notes, and export pipeline data.
          </p>
        </div>
      </div>

      {/* Main Leads Data Table */}
      <LeadsTable
        initialLeads={leads}
        initialSelectedId={params.id}
        initialOpenCreate={params.new === "1"}
      />
    </div>
  );
}
