import React from "react";

export default function PortfolioLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-6 w-48 bg-white/[0.06] rounded" />
          <div className="h-4 w-72 bg-white/[0.04] rounded" />
        </div>
        <div className="h-10 w-36 bg-white/[0.06] rounded-xl" />
      </div>

      <div className="flex items-center gap-3">
        <div className="h-10 flex-1 bg-white/[0.04] rounded-xl" />
        <div className="h-10 w-44 bg-white/[0.04] rounded-xl" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/[0.06] bg-[#0E0E14] p-5 space-y-4"
          >
            <div className="h-40 w-full bg-white/[0.04] rounded-xl" />
            <div className="h-5 w-3/4 bg-white/[0.06] rounded" />
            <div className="h-4 w-1/2 bg-white/[0.04] rounded" />
            <div className="h-8 w-full bg-white/[0.03] rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
