"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  ShieldCheck,
  Minimize2,
  RefreshCw,
  PhoneCall,
} from "lucide-react";
// NOTE: the widget deliberately does NOT import @supabase/supabase-js or the
// Supabase client. Chat traffic is proxied through /api/chat/*, and updates are
// delivered by polling that endpoint. This keeps Supabase out of the public
// bundle and means the chat tables need no anon RLS policy at all.

export interface ChatMessage {
  id: string;
  sender: "visitor" | "bot" | "admin";
  content: string;
  metadata?: {
    quickReplies?: string[];
    isSystemNotice?: boolean;
    adminEmail?: string;
  };
  created_at: string;
}

export interface ChatSession {
  id: string;
  visitor_id: string;
  status: "bot" | "human" | "resolved";
  unread_visitor_count?: number;
  last_message?: string;
}

export function ChatWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [visitorId, setVisitorId] = useState<string>("");
  const [session, setSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Hide widget on admin routes
  const isAdminRoute = pathname?.startsWith("/admin");

  // 1. Initialize or load Visitor ID from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    let vid = localStorage.getItem("neuralwaves_chat_vid");
    if (!vid) {
      vid = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      localStorage.setItem("neuralwaves_chat_vid", vid);
    }
    setVisitorId(vid);
  }, []);

  // 2. Fetch session and initial history
  const fetchSessionHistory = useCallback(async (vid: string) => {
    if (!vid) return;
    try {
      const res = await fetch(`/api/chat/session?visitorId=${encodeURIComponent(vid)}`);
      const data = await res.json();
      if (data.success && data.session) {
        setSession(data.session);
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.warn("Failed fetching chat session:", err);
    }
  }, []);

  useEffect(() => {
    if (visitorId) {
      fetchSessionHistory(visitorId);
    }
  }, [visitorId, fetchSessionHistory]);

  // 3. Scroll to bottom when messages change
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setUnreadCount(0);
    }
  }, [messages, isOpen, scrollToBottom]);

  // 4. Focus input when chat opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  // 5. Resilient polling for live updates (replaces the Supabase Realtime
  //    subscription, which required permissive RLS on the chat tables and
  //    therefore leaked visitor data).
  useEffect(() => {
    if (!session?.id) return;

    const pollInterval = setInterval(() => {
      if (visitorId) {
        fetch(`/api/chat/session?visitorId=${encodeURIComponent(visitorId)}`)
          .then((r) => r.json())
          .then((data) => {
            if (data.success && data.messages) {
              setMessages((prev) => {
                if (data.messages.length > prev.length) {
                  if (!isOpen) {
                    setUnreadCount((c) => c + (data.messages.length - prev.length));
                  }
                  return data.messages;
                }
                return prev;
              });
              if (data.session) setSession(data.session);
            }
          })
          .catch(() => {});
      }
    }, isOpen ? 3000 : 10000);

    return () => clearInterval(pollInterval);
  }, [session?.id, visitorId, isOpen]);

  // 6. Send message handler
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend !== undefined ? textToSend : inputValue).trim();
    if (!text || isLoading || !visitorId) return;

    setInputValue("");
    setIsLoading(true);
    setIsTyping(true);

    // Optimistic visitor message
    const tempVisitorMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      sender: "visitor",
      content: text,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempVisitorMsg]);

    try {
      const res = await fetch("/api/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorId,
          message: text,
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (data.session) setSession(data.session);
        // Replace temp message with server messages
        setMessages((prev) => {
          const withoutTemp = prev.filter((m) => m.id !== tempVisitorMsg.id);
          const newOnes = data.messages || [];
          const combined = [...withoutTemp];
          for (const msg of newOnes) {
            if (!combined.some((m) => m.id === msg.id)) {
              combined.push(msg);
            }
          }
          return combined;
        });
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  // If on admin route, do not render visitor chat widget
  if (isAdminRoute) {
    return null;
  }

  // Active quick replies from the latest bot message
  const lastBotMessage = [...messages].reverse().find((m) => m.sender === "bot");
  const quickReplies = lastBotMessage?.metadata?.quickReplies || [
    "1. Services",
    "2. Pricing",
    "3. Recent Projects",
    "4. Talk to Human",
  ];

  return (
    <>
      {/* ── Floating Launch Trigger Button ── */}
      <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3">
        {!isOpen && unreadCount > 0 && (
          <div className="hidden sm:flex items-center gap-2 bg-[#0F0F14]/90 border border-violet-500/30 text-white text-xs px-3 py-1.5 rounded-full shadow-lg backdrop-blur-md animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-ping" />
            <span>New message from engineer</span>
          </div>
        )}

        <button
          onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen) setUnreadCount(0);
          }}
          aria-label={isOpen ? "Close Live Assistant" : "Open Live Assistant"}
          className="relative group flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 text-white shadow-xl shadow-violet-600/25 hover:shadow-violet-600/40 hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20"
        >
          {isOpen ? (
            <X className="w-6 h-6 transition-transform group-hover:rotate-90 duration-200" />
          ) : (
            <>
              <MessageSquare className="w-6 h-6 transition-transform group-hover:scale-110 duration-200" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] px-1 items-center justify-center rounded-full bg-red-500 text-white font-mono text-[10px] font-bold border-2 border-[#07070A] shadow-md animate-pulse">
                  {unreadCount}
                </span>
              )}
            </>
          )}
        </button>
      </div>

      {/* ── Chat Window Dialog ── */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="NeuralWaves Live Chat Assistant"
          className="fixed inset-0 sm:inset-auto sm:bottom-24 sm:right-5 z-50 sm:w-[390px] sm:h-[600px] bg-[#0F0F14] sm:border sm:border-white/10 sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-zinc-100 font-sans"
        >
          {/* Header */}
          <div className="px-4 py-3.5 bg-[#14141C] border-b border-white/[0.08] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-violet-600/20 border border-violet-500/40 flex items-center justify-center text-violet-400">
                  {session?.status === "human" ? (
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Bot className="w-5 h-5" />
                  )}
                </div>
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#14141C] ${
                    session?.status === "human" ? "bg-emerald-400" : "bg-violet-400"
                  }`}
                />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-semibold text-sm tracking-tight text-white">
                    NeuralWaves Studio
                  </h3>
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-violet-500/10 text-violet-300 border border-violet-500/20">
                    Dubai
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 flex items-center gap-1">
                  {session?.status === "human" ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Engineer Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-violet-400" />
                      Instant AI · Fixed Price Scoping
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => fetchSessionHistory(visitorId)}
                title="Refresh messages"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Minimize chat"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-colors"
              >
                <Minimize2 className="w-4 h-4 hidden sm:block" />
                <X className="w-5 h-5 sm:hidden" />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5 text-sm custom-scrollbar bg-[#0B0B0F]/50">
            {messages.map((msg) => {
              const isVisitor = msg.sender === "visitor";
              const isAdmin = msg.sender === "admin";

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isVisitor ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`flex items-start gap-2 max-w-[88%] ${
                      isVisitor ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    {!isVisitor && (
                      <div
                        className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 text-xs ${
                          isAdmin
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                        }`}
                      >
                        {isAdmin ? <ShieldCheck className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                      </div>
                    )}

                    <div
                      className={`px-3.5 py-2.5 rounded-2xl leading-relaxed whitespace-pre-wrap break-words ${
                        isVisitor
                          ? "bg-violet-600 text-white rounded-tr-none shadow-md"
                          : isAdmin
                          ? "bg-[#181824] border border-emerald-500/30 text-zinc-100 rounded-tl-none shadow-sm"
                          : "bg-[#161620] border border-white/10 text-zinc-200 rounded-tl-none shadow-sm"
                      }`}
                    >
                      {isAdmin && (
                        <div className="text-[10px] font-mono text-emerald-400 font-semibold mb-1 flex items-center gap-1">
                          <span>Verified Dubai Engineer</span>
                        </div>
                      )}
                      <div>{msg.content}</div>
                    </div>
                  </div>

                  <span className="text-[10px] text-zinc-500 mt-1 px-1">
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 text-zinc-400 text-xs py-1">
                <div className="w-6 h-6 rounded-md bg-violet-500/20 text-violet-300 border border-violet-500/30 flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-[#161620] border border-white/10 px-3 py-2 rounded-xl rounded-tl-none flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Reply Chips (Only show if bot mode or quick replies present) */}
          {quickReplies.length > 0 && !isLoading && (
            <div className="px-3 py-2 bg-[#101017] border-t border-white/[0.05] overflow-x-auto flex gap-1.5 no-scrollbar shrink-0">
              {quickReplies.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(chip.split(".")[0].trim())}
                  className="whitespace-nowrap px-2.5 py-1 text-xs rounded-full bg-white/[0.04] hover:bg-violet-600/20 border border-white/10 hover:border-violet-500/40 text-zinc-300 hover:text-violet-200 transition-all shrink-0"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* Chat Input Bar */}
          <div className="p-3 bg-[#14141C] border-t border-white/[0.08] shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={
                  session?.status === "human"
                    ? "Reply to engineer..."
                    : "Type a message or number (1-4)..."
                }
                disabled={isLoading}
                className="flex-1 bg-black/40 border border-white/10 focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/40 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none transition-all disabled:opacity-50"
              />

              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                aria-label="Send message"
                className="p-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:hover:bg-violet-600 text-white transition-all shadow-md active:scale-95 shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-500 px-1">
              <span>Dubai office · Typically replies in &lt; 2m</span>
              <a
                href="https://wa.me/918840936715"
                target="_blank"
                rel="noreferrer"
                className="text-violet-400 hover:underline flex items-center gap-1"
              >
                <PhoneCall className="w-2.5 h-2.5" />
                WhatsApp us
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
