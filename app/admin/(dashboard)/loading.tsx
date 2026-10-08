export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header bar skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-white/[0.08]">
        <div className="space-y-2">
          <div className="h-4 w-32 bg-violet-500/20 rounded" />
          <div className="h-8 w-48 bg-white/[0.08] rounded-lg" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-28 bg-white/[0.06] rounded-lg" />
          <div className="h-9 w-28 bg-violet-500/20 rounded-lg" />
        </div>
      </div>

      {/* Stat cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-5 rounded-2xl border border-white/[0.06] bg-[#0F0F14] space-y-3"
          >
            <div className="h-4 w-24 bg-white/[0.04] rounded" />
            <div className="h-8 w-16 bg-white/[0.08] rounded" />
            <div className="h-3 w-32 bg-white/[0.04] rounded" />
          </div>
        ))}
      </div>

      {/* Main card skeleton */}
      <div className="h-80 rounded-2xl border border-white/[0.06] bg-[#0F0F14] p-6 space-y-4">
        <div className="h-5 w-40 bg-white/[0.06] rounded" />
        <div className="h-4 w-64 bg-white/[0.04] rounded" />
        <div className="h-48 w-full bg-white/[0.02] rounded-xl" />
      </div>
    </div>
  );
}
