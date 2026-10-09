import React from "react";
import { getAdminChatSessions } from "@/app/admin/chats/actions";
import { ChatsList } from "@/components/admin/chats-list";

export const metadata = {
  title: "Website Live Chats | NeuralWaves Admin",
  description: "Monitor visitor chats, intervene live, and review menu bot interactions.",
};

export const dynamic = "force-dynamic";

export default async function AdminChatsPage() {
  const sessions = await getAdminChatSessions();

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs uppercase tracking-wider text-violet-400">
              Live Messaging
            </span>
            <span className="text-white/20">•</span>
            <span className="text-xs text-white/50">{sessions.length} total conversations</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Website Chats</h1>
          <p className="text-sm text-white/50 mt-1">
            Live visitor inquiries, automated bot routing, and real-time operator intervention.
          </p>
        </div>
      </div>

      {/* Main Chats List */}
      <ChatsList initialSessions={sessions} />
    </div>
  );
}
