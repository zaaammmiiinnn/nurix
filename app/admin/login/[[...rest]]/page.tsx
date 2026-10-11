"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  ArrowRight,
  Loader2,
  ShieldAlert,
  Lock,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/ui/logo";
import { loginWithAdminPassword } from "../actions";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");
  const rejectedEmail = searchParams.get("email");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.set("email", email);
      formData.set("password", password);

      const res = await loginWithAdminPassword(formData);

      if (res.success) {
        if (res.mustChangePassword) {
          toast.info("Temporary password detected. Please set your permanent password.");
          router.push(res.redirectUrl || "/admin/change-password");
        } else {
          toast.success("Signed in successfully!");
          router.push(res.redirectUrl || "/admin");
        }
        router.refresh();
      } else {
        toast.error(res.error || "Authentication failed.");
      }
    } catch {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#07070A] relative overflow-hidden select-none">
      {/* Background radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[450px] rounded-full blur-[140px] pointer-events-none opacity-20"
        style={{
          background: "radial-gradient(circle, #8B5CF6 0%, #22D3EE 50%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Wordmark */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2">
            <Logo size="lg" />
            <span className="font-mono text-xs uppercase px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300">
              Admin Ops
            </span>
          </div>
          <p className="text-xs font-mono text-zinc-500">
            Secure Authentication Portal
          </p>
        </div>

        {/* Security / Verification Badge */}
        <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-zinc-400 bg-white/[0.03] border border-white/[0.06] py-1.5 px-3 rounded-full mx-auto w-fit">
          <ShieldCheck size={13} className="text-emerald-400" />
          <span>Restricted to Verified Administrators Only</span>
        </div>

        {/* Error Alert from redirect */}
        {errorParam === "not_authorized" && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300 space-y-1">
            <div className="flex items-center gap-2 font-medium">
              <ShieldAlert size={16} className="text-rose-400 shrink-0" />
              Access Denied
            </div>
            <p className="text-rose-200/80 leading-relaxed">
              {rejectedEmail ? `Account (${rejectedEmail})` : "Your account"} is not authorized to access the admin portal.
            </p>
          </div>
        )}

        {/* Login Card */}
        <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-6 shadow-2xl space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 pb-2 border-b border-white/[0.06]">
            <Lock size={14} className="text-violet-400" />
            <span>Administrator Sign In</span>
          </div>

          <form onSubmit={handlePasswordLogin} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
                />
                <input
                  type="email"
                  required
                  autoComplete="username"
                  placeholder="admin@neuralwaves.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/60 transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/60 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider text-white btn-glow flex items-center justify-center gap-2 disabled:opacity-50 transition-all mt-6"
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Verifying Credentials...
                </>
              ) : (
                <>
                  Sign In to Admin Portal
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Security notice */}
          <div className="pt-2 border-t border-white/[0.06] text-center">
            <p className="text-[10px] font-mono text-zinc-500">
              Encrypted credentials are authenticated directly against authorized administrator records.
            </p>
          </div>
        </div>

        {/* Back to site */}
        <div className="text-center">
          <Link
            href="/"
            className="text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            ← Back to neuralwaves.in
          </Link>
        </div>
      </div>
    </div>
  );
}
