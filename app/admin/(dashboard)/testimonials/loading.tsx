import React from "react";

export default function TestimonialsLoading() {
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/[0.06] bg-[#0A0A0F] p-6 space-y-4"
          >
            <div className="h-4 w-24 bg-white/[0.06] rounded" />
            <div className="h-16 w-full bg-white/[0.04] rounded" />
            <div className="flex items-center gap-3 pt-2">
              <div className="w-9 h-9 rounded-full bg-white/[0.06]" />
              <div className="space-y-1.5 flex-1">
                <div className="h-4 w-28 bg-white/[0.06] rounded" />
                <div className="h-3 w-36 bg-white/[0.04] rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
