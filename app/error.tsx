"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function RootError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to monitoring if configured
    console.error("Application error boundary triggered:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#07070A] text-white flex items-center justify-center px-6 py-24 relative overflow-hidden select-none">
      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-[140px] pointer-events-none opacity-20"
        style={{
          background: "radial-gradient(circle, #EF4444 0%, #8B5CF6 60%, transparent 80%)",
        }}
        aria-hidden="true"
      />

      <div className="max-w-md w-full text-center space-y-6 relative z-10">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-400">
          <AlertTriangle size={30} />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-xs uppercase tracking-widest text-red-400">
            System Alert • Error 500
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Something went wrong
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            An unexpected error occurred while rendering this view. Our team has been notified.
          </p>
        </div>

        {error.digest && (
          <div className="p-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] font-mono text-[11px] text-zinc-500">
            Digest: {error.digest}
          </div>
        )}

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="btn-glow px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <RefreshCw size={14} />
            Try again
          </button>
          <Link
            href="/"
            className="btn-ghost-border px-6 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider text-zinc-300 hover:text-white flex items-center justify-center gap-1.5 w-full sm:w-auto"
          >
            <Home size={14} />
            Return Home
          </Link>
        </div>

        <div className="pt-6 border-t border-white/[0.06] text-xs text-zinc-500 font-mono">
          Need immediate assistance?{" "}
          <a
            href="https://wa.me/971501234567"
            target="_blank"
            rel="noopener noreferrer"
            className="text-violet-400 hover:underline"
          >
            WhatsApp Support
          </a>
        </div>
      </div>
    </div>
  );
}
