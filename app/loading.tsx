export default function Loading() {
  return (
    <div className="pt-28 pb-32 min-h-screen max-w-7xl mx-auto px-6 md:px-8 space-y-12 animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-3">
        <div className="h-3 w-16 bg-white/[0.06] rounded" />
        <div className="h-3 w-3 bg-white/[0.04] rounded" />
        <div className="h-3 w-24 bg-white/[0.06] rounded" />
      </div>

      {/* Header skeleton */}
      <div className="space-y-4 max-w-2xl">
        <div className="h-4 w-32 bg-violet-500/20 rounded-full" />
        <div className="h-12 w-3/4 bg-white/[0.08] rounded-xl" />
        <div className="h-5 w-full bg-white/[0.04] rounded-lg" />
        <div className="h-5 w-2/3 bg-white/[0.04] rounded-lg" />
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-80 rounded-2xl border border-white/[0.06] bg-[#0A0A0F] p-6 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="h-10 w-10 bg-white/[0.06] rounded-xl" />
              <div className="h-6 w-3/4 bg-white/[0.08] rounded-lg" />
              <div className="h-4 w-full bg-white/[0.04] rounded" />
              <div className="h-4 w-5/6 bg-white/[0.04] rounded" />
            </div>
            <div className="h-10 w-full bg-white/[0.04] rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
