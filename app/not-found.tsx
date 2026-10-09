import Link from "next/link";
import { Home, MessageSquare } from "lucide-react";

export const metadata = {
  title: "404 — Page Not Found",
  description: "The requested page does not exist or has been moved.",
  // Must never be indexed. Next 14 streams the response, so a notFound() raised
  // by a dynamic route still carries an HTTP 200 status; without this, unknown
  // /work/* and /services/* URLs would be treated as real pages. This also
  // prevents the root layout's canonical (the homepage) from being inherited and
  // telling search engines that every bad URL is the homepage.
  robots: { index: false, follow: false },
  alternates: { canonical: null },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#07070A] text-white flex items-center justify-center px-6 py-24 relative overflow-hidden select-none">
      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] rounded-full blur-[140px] pointer-events-none opacity-20"
        style={{
          background: "radial-gradient(circle, #8B5CF6 0%, #22D3EE 60%, transparent 80%)",
        }}
        aria-hidden="true"
      />

      <div className="max-w-md w-full text-center space-y-6 relative z-10">
        <div className="space-y-2">
          <span className="font-mono text-xs uppercase tracking-widest text-violet-400 border border-violet-500/20 bg-violet-500/10 px-3 py-1 rounded-full">
            404 • Missing Endpoint
          </span>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-white font-mono pt-4">
            Not Found
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed pt-2">
            The page or case study you are looking for does not exist, has been archived, or moved to a new route.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-white/[0.08] bg-[#0A0A0F] text-left space-y-2 text-xs">
          <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500 block">
            Suggested Destinations
          </span>
          <div className="flex flex-col gap-1.5 font-mono">
            <Link href="/services" className="text-zinc-300 hover:text-violet-400 transition-colors">
              → /services — Core automation offerings
            </Link>
            <Link href="/work" className="text-zinc-300 hover:text-violet-400 transition-colors">
              → /work — Shipped client case studies
            </Link>
            <Link href="/pricing" className="text-zinc-300 hover:text-violet-400 transition-colors">
              → /pricing — Fixed pricing in AED
            </Link>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="btn-glow px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <Home size={14} />
            Back to homepage
          </Link>
          <Link
            href="/contact"
            className="btn-ghost-border px-6 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider text-zinc-300 hover:text-white flex items-center justify-center gap-1.5 w-full sm:w-auto"
          >
            <MessageSquare size={14} />
            Contact studio
          </Link>
        </div>
      </div>
    </div>
  );
}
