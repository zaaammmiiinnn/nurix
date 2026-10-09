import React from "react";

export default function LeadsLoading() {
  return (
    <div className="space-y-6 animate-pulse select-none">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-white/[0.08]">
        <div className="space-y-2">
          <div className="h-3 w-32 bg-white/[0.06] rounded" />
          <div className="h-7 w-48 bg-white/[0.1] rounded-lg" />
          <div className="h-4 w-72 bg-white/[0.04] rounded" />
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="h-10 w-72 bg-white/[0.05] rounded-xl border border-white/[0.06]" />
        <div className="h-10 w-36 bg-white/[0.05] rounded-xl border border-white/[0.06]" />
      </div>

      <div className="rounded-2xl border border-white/[0.08] bg-[#0A0A0F] overflow-hidden">
        <div className="h-12 border-b border-white/[0.08] bg-white/[0.02]" />
        <div className="divide-y divide-white/[0.04]">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 flex items-center px-6 gap-6">
              <div className="w-4 h-4 bg-white/[0.05] rounded" />
              <div className="w-36 h-4 bg-white/[0.07] rounded" />
              <div className="w-24 h-4 bg-white/[0.05] rounded" />
              <div className="w-20 h-5 bg-white/[0.06] rounded-full" />
              <div className="w-28 h-4 bg-white/[0.04] rounded" />
              <div className="w-16 h-8 bg-white/[0.06] rounded-lg ml-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
