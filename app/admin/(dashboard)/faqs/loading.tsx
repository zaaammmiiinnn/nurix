import React from "react";

export default function FaqsLoading() {
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

      <div className="rounded-2xl border border-white/[0.06] bg-[#0A0A0F] p-6 space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="py-4 border-b border-white/[0.04] space-y-2">
            <div className="h-5 w-2/3 bg-white/[0.06] rounded" />
            <div className="h-4 w-full bg-white/[0.04] rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
