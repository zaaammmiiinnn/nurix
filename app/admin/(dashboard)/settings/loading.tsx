import React from "react";

export default function SettingsLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-6 w-48 bg-white/[0.06] rounded" />
          <div className="h-4 w-72 bg-white/[0.04] rounded" />
        </div>
        <div className="h-10 w-36 bg-white/[0.06] rounded-xl" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-white/[0.06] bg-[#0A0A0F] p-6 space-y-4">
            <div className="h-5 w-40 bg-white/[0.06] rounded" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="h-12 bg-white/[0.03] rounded-xl" />
              <div className="h-12 bg-white/[0.03] rounded-xl" />
            </div>
          </div>
          <div className="rounded-2xl border border-white/[0.06] bg-[#0A0A0F] p-6 space-y-4">
            <div className="h-5 w-40 bg-white/[0.06] rounded" />
            <div className="h-20 bg-white/[0.03] rounded-xl" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-white/[0.06] bg-[#0A0A0F] p-6 space-y-4">
            <div className="h-5 w-32 bg-white/[0.06] rounded" />
            <div className="h-16 bg-white/[0.03] rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
