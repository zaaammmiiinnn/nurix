"use client";

import React from "react";
import { UserButton, SignOutButton } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import { signOutAdmin } from "@/app/admin/login/actions";

interface AdminUserNavProps {
  adminEmail: string;
  isClerkAuth?: boolean;
}

export function AdminUserNav({ adminEmail, isClerkAuth }: AdminUserNavProps) {
  if (isClerkAuth) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-3 px-2 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <UserButton
            afterSignOutUrl="/admin/login"
            appearance={{
              elements: {
                userButtonAvatarBox: "w-8 h-8 rounded-lg border border-violet-500/30",
              },
            }}
          />
          <div className="flex-1 min-w-0">
            <span className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500">
              Clerk Verified
            </span>
            <span
              className="block text-xs font-mono text-zinc-200 truncate"
              title={adminEmail}
            >
              {adminEmail}
            </span>
          </div>
        </div>

        <SignOutButton redirectUrl="/admin/login">
          <button
            type="button"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </SignOutButton>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="px-3 py-1">
        <span className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500">
          Signed In As
        </span>
        <span
          className="block text-xs font-mono text-zinc-300 truncate"
          title={adminEmail}
        >
          {adminEmail}
        </span>
      </div>

      <form action={signOutAdmin}>
        <button
          type="submit"
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </form>
    </div>
  );
}
