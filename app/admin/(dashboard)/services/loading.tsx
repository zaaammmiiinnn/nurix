import React from "react";

export default function ServicesLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-6 w-48 bg-white/[0.06] rounded" />
          <div className="h-4 w-72 bg-white/[0.04] rounded" />
        </div>
        <div className="h-10 w-36 bg-white/[0.06] rounded-xl" />
      </div>

      <div className="h-12 w-full bg-white/[0.04] rounded-2xl" />

      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/[0.06] bg-[#0A0A0F] p-6 space-y-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/[0.04] rounded-xl" />
              <div className="space-y-2 flex-1">
                <div className="h-5 w-48 bg-white/[0.06] rounded" />
                <div className="h-4 w-64 bg-white/[0.04] rounded" />
              </div>
            </div>
            <div className="h-12 w-full bg-white/[0.03] rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
