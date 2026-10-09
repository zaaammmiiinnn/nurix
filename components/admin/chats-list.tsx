"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Search,
  Bot,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
} from "lucide-react";
import { AdminChatSession } from "@/app/admin/chats/actions";

interface ChatsListProps {
  initialSessions: AdminChatSession[];
}

export function ChatsList({ initialSessions }: ChatsListProps) {
  const [sessions] = useState<AdminChatSession[]>(initialSessions);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "human" | "bot" | "resolved">("all");

  const filteredSessions = sessions.filter((s) => {
    // Status filter
    if (filterStatus !== "all" && s.status !== filterStatus) {
      return false;
    }

    // Search query
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchEmail = s.visitor_email?.toLowerCase().includes(q);
      const matchName = s.visitor_name?.toLowerCase().includes(q);
      const matchVid = s.visitor_id.toLowerCase().includes(q);
      const matchMsg = s.last_message?.toLowerCase().includes(q);
      return Boolean(matchEmail || matchName || matchVid || matchMsg);
    }

    return true;
  });

  const humanCount = sessions.filter((s) => s.status === "human").length;
  const botCount = sessions.filter((s) => s.status === "bot").length;
  const unreadTotal = sessions.reduce((acc, s) => acc + (s.unread_admin_count || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Filter & Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Status Pill Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-x-auto">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
              filterStatus === "all"
                ? "bg-violet-600 text-white shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <span>All Sessions ({sessions.length})</span>
            {unreadTotal > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold leading-none">
                {unreadTotal}
              </span>
            )}
          </button>
          <button
            onClick={() => setFilterStatus("human")}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-all ${
              filterStatus === "human"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-zinc-400 hover:text-emerald-400"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Human Attention ({humanCount})
          </button>
          <button
            onClick={() => setFilterStatus("bot")}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              filterStatus === "bot"
                ? "bg-violet-600 text-white shadow-sm"
                : "text-zinc-400 hover:text-violet-400"
            }`}
          >
            Bot Active ({botCount})
          </button>
          <button
            onClick={() => setFilterStatus("resolved")}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              filterStatus === "resolved"
                ? "bg-zinc-700 text-white shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Resolved
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search email, visitor ID, message..."
            className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-violet-500/50 rounded-xl pl-9 pr-3.5 py-1.5 text-xs text-white placeholder:text-zinc-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* Sessions Grid / Table */}
      {filteredSessions.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-white/[0.08] bg-[#0A0A0F]">
          <MessageSquare className="w-10 h-10 mx-auto text-zinc-600 mb-3" />
          <h3 className="text-sm font-medium text-white mb-1">No Chat Sessions Found</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            {searchTerm
              ? `No sessions match "${searchTerm}". Try resetting your filter.`
              : "When visitors interact with the website chat widget, their conversations will appear here in real time."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filteredSessions.map((s) => {
            const hasUnread = (s.unread_admin_count || 0) > 0;
            const isHuman = s.status === "human";
            const isResolved = s.status === "resolved";

            return (
              <Link
                key={s.id}
                href={`/admin/chats/${s.id}`}
                className={`group p-4 rounded-xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  hasUnread
                    ? "bg-[#14121F] border-violet-500/40 hover:border-violet-500/80 shadow-md shadow-violet-500/5"
                    : "bg-[#0A0A0F] border-white/[0.08] hover:border-white/20 hover:bg-[#0F0F16]"
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                      isHuman
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : isResolved
                        ? "bg-zinc-800 text-zinc-400 border-zinc-700"
                        : "bg-violet-500/10 text-violet-400 border-violet-500/30"
                    }`}
                  >
                    {isHuman ? (
                      <ShieldCheck className="w-5 h-5" />
                    ) : isResolved ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Bot className="w-5 h-5" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-semibold text-sm text-white truncate">
                        {s.visitor_name || s.visitor_email || `Visitor #${s.visitor_id.slice(-6)}`}
                      </span>

                      {s.visitor_email && (
                        <span className="text-xs text-violet-300 font-mono bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20">
                          {s.visitor_email}
                        </span>
                      )}

                      {/* Status Badge */}
                      <span
                        className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border ${
                          isHuman
                            ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                            : isResolved
                            ? "bg-zinc-800 text-zinc-400 border-zinc-700"
                            : "bg-violet-500/10 text-violet-300 border-violet-500/30"
                        }`}
                      >
                        {isHuman ? "Human Agent" : isResolved ? "Resolved" : "Bot Active"}
                      </span>

                      {hasUnread && (
                        <span className="flex h-5 px-1.5 items-center justify-center rounded-full bg-violet-600 text-white font-mono text-[10px] font-bold">
                          {s.unread_admin_count} new
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-zinc-400 line-clamp-1 break-words">
                      {s.last_message || "No messages yet"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-white/[0.05]">
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                    <Clock className="w-3 h-3" />
                    <span>
                      {new Date(s.last_message_at).toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      at{" "}
                      {new Date(s.last_message_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <span className="p-2 rounded-lg bg-white/[0.04] group-hover:bg-violet-600 group-hover:text-white text-zinc-400 transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
