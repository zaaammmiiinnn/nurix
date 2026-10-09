import React from "react";

export default function ChatsLoading() {
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
        <div className="h-9 w-64 bg-white/[0.05] rounded-xl border border-white/[0.06]" />
        <div className="h-9 w-48 bg-white/[0.05] rounded-xl border border-white/[0.06]" />
      </div>

      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-4 rounded-xl border border-white/[0.08] bg-[#0A0A0F] flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/[0.06]" />
              <div className="space-y-2">
                <div className="h-4 w-40 bg-white/[0.08] rounded" />
                <div className="h-3 w-64 bg-white/[0.04] rounded" />
              </div>
            </div>
            <div className="h-4 w-24 bg-white/[0.05] rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
