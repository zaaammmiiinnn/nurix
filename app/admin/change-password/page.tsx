"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  KeyRound,
  ShieldAlert,
  Loader2,
  CheckCircle2,
  Eye,
  EyeOff,
  ArrowRight,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/ui/logo";
import { changeAdminPassword } from "@/app/admin/login/actions";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword === currentPassword) {
      toast.error("New password must be different from your current password.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.set("currentPassword", currentPassword);
      formData.set("newPassword", newPassword);
      formData.set("confirmPassword", confirmPassword);

      const res = await changeAdminPassword(formData);

      if (res.success) {
        toast.success(res.message || "Password updated successfully!");
        router.push(res.redirectUrl || "/admin");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to update password.");
        if (res.redirect) {
          router.push(res.redirect);
        }
      }
    } catch {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const passwordLengthOk = newPassword.length >= 8;
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

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
        {/* Brand Wordmark */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2">
            <Logo size="lg" />
            <span className="font-mono text-xs uppercase px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300">
              Admin Ops
            </span>
          </div>
          <p className="text-xs font-mono text-zinc-500">
            Account Security Configuration
          </p>
        </div>

        {/* Security Warning Badge */}
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-200 space-y-1.5">
          <div className="flex items-center gap-2 font-medium text-amber-300">
            <ShieldAlert size={16} className="text-amber-400 shrink-0" />
            Temporary Password Detected
          </div>
          <p className="text-amber-200/80 leading-relaxed text-[11px]">
            Your administrator account was provisioned with an initial temporary password.
            Please choose a secure, permanent password to access the operations dashboard.
          </p>
        </div>

        {/* Change Password Card */}
        <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-6 shadow-2xl space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 pb-2 border-b border-white/[0.06]">
            <KeyRound size={14} className="text-violet-400" />
            <span>Create Permanent Password</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Current (Temporary) Password */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                Current (Temporary) Password
              </label>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
                />
                <input
                  type={showCurrent ? "text" : "password"}
                  required
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/60 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                >
                  {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                New Password
              </label>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
                />
                <input
                  type={showNew ? "text" : "password"}
                  required
                  placeholder="At least 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/60 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                >
                  {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              {/* Requirement pill */}
              <div className="flex items-center gap-1.5 pt-1 text-[11px] font-mono">
                {passwordLengthOk ? (
                  <CheckCircle2 size={13} className="text-emerald-400" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                )}
                <span className={passwordLengthOk ? "text-emerald-400" : "text-zinc-500"}>
                  Minimum 8 characters
                </span>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
                />
                <input
                  type={showConfirm ? "text" : "password"}
                  required
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/60 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                >
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              {confirmPassword.length > 0 && (
                <div className="flex items-center gap-1.5 pt-1 text-[11px] font-mono">
                  {passwordsMatch ? (
                    <CheckCircle2 size={13} className="text-emerald-400" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  )}
                  <span className={passwordsMatch ? "text-emerald-400" : "text-rose-400"}>
                    {passwordsMatch ? "Passwords match" : "Passwords do not match"}
                  </span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !passwordLengthOk || !passwordsMatch}
              className="w-full py-3 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider text-white btn-glow flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-6"
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Updating Password...
                </>
              ) : (
                <>
                  Set Permanent Password
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back to site / Logout */}
        <div className="text-center">
          <Link
            href="/admin/login"
            className="text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            ← Return to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
