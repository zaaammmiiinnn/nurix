"use client";

import React, { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface AdminErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AdminError({ error, reset }: AdminErrorProps) {
  useEffect(() => {
    console.error("Admin dashboard exception:", error);
  }, [error]);

  return (
    <div className="p-8 rounded-2xl border border-red-500/20 bg-red-950/10 space-y-4 max-w-2xl mx-auto my-12 text-center">
      <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center mx-auto text-red-400">
        <AlertCircle size={24} />
      </div>

      <div className="space-y-1">
        <h2 className="text-xl font-bold text-white tracking-tight">Admin Operations Error</h2>
        <p className="text-sm text-zinc-400">
          Failed to load administration resources. Your session is intact.
        </p>
      </div>

      {error.message && (
        <pre className="p-3 rounded-lg bg-black/40 border border-white/[0.08] text-xs font-mono text-red-300 text-left overflow-x-auto max-h-40">
          {error.message}
        </pre>
      )}

      <div className="pt-2">
        <button
          onClick={() => reset()}
          className="btn-glow px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-white inline-flex items-center gap-2"
        >
          <RefreshCw size={14} />
          Retry operation
        </button>
      </div>
    </div>
  );
}
