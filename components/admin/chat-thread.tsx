"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bot,
  User,
  ShieldCheck,
  Send,
  CheckCircle2,
  Copy,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import {
  AdminChatSession,
  AdminChatMessage,
  updateChatStatusAction,
  sendAdminReplyAction,
} from "@/app/admin/chats/actions";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { toast } from "sonner";

interface ChatThreadProps {
  initialSession: AdminChatSession;
  initialMessages: AdminChatMessage[];
}

export function ChatThread({ initialSession, initialMessages }: ChatThreadProps) {
  const [session, setSession] = useState<AdminChatSession>(initialSession);
  const [messages, setMessages] = useState<AdminChatMessage[]>(initialMessages);
  const [replyText, setReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // 1. Supabase Realtime Subscription + Resilient Polling for live updates
  useEffect(() => {
    if (!session?.id) return;

    let channel: RealtimeChannel | null = null;

    if (isSupabaseConfigured && supabase) {
      try {
        channel = supabase
          .channel(`admin_chat_thread:${session.id}`)
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "chat_messages",
              filter: `session_id=eq.${session.id}`,
            },
            (payload) => {
              const newMsg = payload.new as AdminChatMessage;
              setMessages((prev) => {
                if (prev.some((m) => m.id === newMsg.id)) return prev;
                return [...prev, newMsg];
              });
            }
          )
          .subscribe();
      } catch (err) {
        console.warn("Realtime admin subscription failed, falling back to polling:", err);
      }
    }

    // Polling fallback every 2.5 seconds
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/chat/session?visitorId=${encodeURIComponent(session.visitor_id)}`);
        const data = await res.json();
        if (data.success && data.messages) {
          setMessages((prev) => {
            if (data.messages.length !== prev.length) {
              return data.messages;
            }
            return prev;
          });
          if (data.session) {
            setSession((s) => ({ ...s, ...data.session }));
          }
        }
      } catch {}
    }, 2500);

    return () => {
      clearInterval(interval);
      if (channel && supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, [session.id, session.visitor_id]);

  // 2. Handle Admin Reply
  const handleSendReply = async () => {
    const text = replyText.trim();
    if (!text || isSending) return;

    setReplyText("");
    setIsSending(true);

    // Optimistic insert
    const tempId = `temp-${Date.now()}`;
    const optimisticMsg: AdminChatMessage = {
      id: tempId,
      session_id: session.id,
      sender: "admin",
      content: text,
      metadata: { adminEmail: "You" },
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      const res = await sendAdminReplyAction(session.id, text);
      if (res.success && res.message) {
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? res.message! : m))
        );
        setSession((s) => ({ ...s, status: "human", last_message: text }));
        toast.success("Reply delivered to visitor");
      } else {
        toast.error(res.error || "Failed to send reply");
      }
    } catch {
      toast.error("Failed to send reply");
    } finally {
      setIsSending(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  // 3. Handle Status Toggle
  const handleStatusChange = async (newStatus: "bot" | "human" | "resolved") => {
    if (session.status === newStatus || isUpdatingStatus) return;

    setIsUpdatingStatus(true);
    try {
      const res = await updateChatStatusAction(session.id, newStatus);
      if (res.success) {
        setSession((s) => ({ ...s, status: newStatus }));
        toast.success(`Chat switched to ${newStatus} mode`);
      } else {
        toast.error(res.message || "Failed to update status");
      }
    } catch {
      toast.error("Failed to update status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${label}`);
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/chats"
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">
                {session.visitor_name || session.visitor_email || `Visitor #${session.visitor_id.slice(-6)}`}
              </h1>
              <span
                className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border ${
                  session.status === "human"
                    ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                    : session.status === "resolved"
                    ? "bg-zinc-800 text-zinc-400 border-zinc-700"
                    : "bg-violet-500/10 text-violet-300 border-violet-500/30"
                }`}
              >
                {session.status === "human"
                  ? "Operator Active"
                  : session.status === "resolved"
                  ? "Resolved"
                  : "Bot Handling"}
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              ID: {session.visitor_id}
            </p>
          </div>
        </div>

        {/* Status Mode Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleStatusChange("human")}
            disabled={isUpdatingStatus || session.status === "human"}
            className={`px-3 py-1.5 text-xs font-medium rounded-xl border flex items-center gap-1.5 transition-all ${
              session.status === "human"
                ? "bg-emerald-600/20 text-emerald-300 border-emerald-500/40"
                : "bg-white/[0.04] border-white/10 text-zinc-300 hover:bg-emerald-600/10 hover:text-emerald-300 hover:border-emerald-500/30"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Take Over (Human)
          </button>

          <button
            onClick={() => handleStatusChange("bot")}
            disabled={isUpdatingStatus || session.status === "bot"}
            className={`px-3 py-1.5 text-xs font-medium rounded-xl border flex items-center gap-1.5 transition-all ${
              session.status === "bot"
                ? "bg-violet-600/20 text-violet-300 border-violet-500/40"
                : "bg-white/[0.04] border-white/10 text-zinc-300 hover:bg-violet-600/10 hover:text-violet-300 hover:border-violet-500/30"
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            Switch to Bot
          </button>

          <button
            onClick={() => handleStatusChange("resolved")}
            disabled={isUpdatingStatus || session.status === "resolved"}
            className={`px-3 py-1.5 text-xs font-medium rounded-xl border flex items-center gap-1.5 transition-all ${
              session.status === "resolved"
                ? "bg-zinc-700/50 text-zinc-200 border-zinc-600"
                : "bg-white/[0.04] border-white/10 text-zinc-400 hover:bg-white/[0.08] hover:text-zinc-200"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Mark Resolved
          </button>
        </div>
      </div>

      {/* Main Grid: Thread on Left, Visitor Metadata on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Chat Conversation Thread (2 Cols) */}
        <div className="lg:col-span-2 flex flex-col h-[650px] bg-[#0A0A0F] border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl">
          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#08080C]/60">
            {messages.map((msg) => {
              const isVisitor = msg.sender === "visitor";
              const isAdmin = msg.sender === "admin";
              const isNotice = Boolean(msg.metadata?.isSystemNotice);

              if (isNotice) {
                return (
                  <div key={msg.id} className="flex justify-center my-2">
                    <span className="text-[11px] font-mono text-zinc-500 bg-white/[0.03] border border-white/[0.06] px-3 py-1 rounded-full">
                      {msg.content}
                    </span>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isAdmin ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`flex items-start gap-2.5 max-w-[85%] ${
                      isAdmin ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs border ${
                        isAdmin
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                          : isVisitor
                          ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/40"
                          : "bg-violet-500/20 text-violet-300 border-violet-500/40"
                      }`}
                    >
                      {isAdmin ? (
                        <ShieldCheck className="w-4 h-4" />
                      ) : isVisitor ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                    </div>

                    <div
                      className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words ${
                        isAdmin
                          ? "bg-emerald-950/40 border border-emerald-500/30 text-emerald-50 rounded-tr-none shadow-sm"
                          : isVisitor
                          ? "bg-[#181824] border border-white/10 text-white rounded-tl-none shadow-sm"
                          : "bg-[#12121A] border border-violet-500/20 text-zinc-200 rounded-tl-none shadow-sm"
                      }`}
                    >
                      <div className="text-[11px] font-mono font-medium mb-1 flex items-center justify-between gap-3 text-zinc-400">
                        <span>
                          {isAdmin
                            ? "Engineer (You)"
                            : isVisitor
                            ? session.visitor_name || "Visitor"
                            : "Menu Bot"}
                        </span>
                        <span className="text-[10px] text-zinc-500">
                          {new Date(msg.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <div>{msg.content}</div>
                    </div>
                  </div>
                </div>
              );
            })}

            <div ref={messagesEndRef} />
          </div>

          {/* Reply Box */}
          <div className="p-3.5 bg-[#0E0E16] border-t border-white/[0.08]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendReply();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type reply to visitor as Dubai Engineer (Enter to send)..."
                disabled={isSending}
                className="flex-1 bg-black/50 border border-white/10 focus:border-violet-500/60 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 outline-none transition-all disabled:opacity-50"
              />

              <button
                type="submit"
                disabled={!replyText.trim() || isSending}
                className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white font-medium text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Visitor Metadata Card */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-[#0A0A0F] border border-white/[0.08] space-y-5">
            <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
              <User className="w-4 h-4 text-violet-400" />
              Visitor Profile
            </h3>

            <div className="space-y-3.5 text-xs">
              <div>
                <span className="text-zinc-500 block mb-1">Email Address</span>
                {session.visitor_email ? (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                    <span className="font-mono text-violet-300 truncate">
                      {session.visitor_email}
                    </span>
                    <button
                      onClick={() => copyToClipboard(session.visitor_email!, "Email")}
                      className="text-zinc-400 hover:text-white p-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <span className="text-zinc-600 italic">Not captured yet</span>
                )}
              </div>

              <div>
                <span className="text-zinc-500 block mb-1">Phone / WhatsApp</span>
                {session.visitor_phone ? (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                    <span className="font-mono text-zinc-300">
                      {session.visitor_phone}
                    </span>
                    <button
                      onClick={() => copyToClipboard(session.visitor_phone!, "Phone")}
                      className="text-zinc-400 hover:text-white p-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <span className="text-zinc-600 italic">Not provided</span>
                )}
              </div>

              <div>
                <span className="text-zinc-500 block mb-1">Visitor Identifier</span>
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                  <span className="font-mono text-zinc-400 text-[11px] truncate">
                    {session.visitor_id}
                  </span>
                  <button
                    onClick={() => copyToClipboard(session.visitor_id, "Visitor ID")}
                    className="text-zinc-400 hover:text-white p-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <span className="text-zinc-500 block mb-1">First Connected</span>
                <span className="text-zinc-300 font-mono text-[11px]">
                  {new Date(session.created_at).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-3 border-t border-white/[0.08] space-y-2">
              <Link
                href="/admin/leads"
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-medium text-white transition-all"
              >
                <span>View in Leads Pipeline</span>
                <ExternalLink className="w-3 h-3 text-zinc-400" />
              </Link>
            </div>
          </div>

          {/* Assistant Info Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-950/20 to-indigo-950/10 border border-violet-500/20 text-xs space-y-2">
            <div className="flex items-center gap-2 text-violet-300 font-medium">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span>Menu Bot Automation Active</span>
            </div>
            <p className="text-zinc-400 leading-relaxed text-[11px]">
              When visitors choose option 1-3, the bot serves services, pricing, and project case studies. When they enter option 4 or their email, a lead is captured and you receive an alert.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
