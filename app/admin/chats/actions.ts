"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import {
  getMemorySessions,
  getMemorySessionById,
  getMemoryMessages,
  addMemoryMessage,
  saveMemorySession,
  InMemoryChatSession,
  InMemoryChatMessage,
} from "@/lib/chat-store";
import { requireAdmin } from "@/lib/auth/require-admin";

export type AdminChatSession = InMemoryChatSession;
export type AdminChatMessage = InMemoryChatMessage;

export async function getAdminChatSessions(): Promise<AdminChatSession[]> {
  await requireAdmin();

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from("chat_sessions")
        .select("*")
        .order("last_message_at", { ascending: false });

      if (!error && data) {
        return data as AdminChatSession[];
      }
      console.warn("Supabase chat_sessions query error:", error?.message);
      return [];
    } catch (err) {
      console.warn("Supabase network error fetching sessions:", err);
      return [];
    }
  }

  // In-memory store is only meaningful when Supabase is not configured (local dev).
  return getMemorySessions();
}

export async function getAdminChatSessionWithMessages(
  id: string
): Promise<{ session: AdminChatSession | null; messages: AdminChatMessage[] }> {
  await requireAdmin();

  let session: AdminChatSession | null = null;
  let messages: AdminChatMessage[] = [];

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data: sessionData, error: sErr } = await supabaseAdmin
        .from("chat_sessions")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (!sErr && sessionData) {
        session = sessionData as AdminChatSession;

        const { data: msgData, error: mErr } = await supabaseAdmin
          .from("chat_messages")
          .select("*")
          .eq("session_id", id)
          .order("created_at", { ascending: true });

        if (!mErr && msgData) {
          messages = msgData as AdminChatMessage[];
        }

        return { session, messages };
      }
    } catch (err) {
      console.warn("Supabase fetch chat session error:", err);
    }
    // Configured but the read failed: never serve isolate-local memory state as
    // if it were the database.
    return { session: null, messages: [] };
  }

  // In-memory store is only meaningful when Supabase is not configured (local dev).
  const memSession = getMemorySessionById(id);
  if (memSession) {
    return {
      session: memSession,
      messages: getMemoryMessages(id),
    };
  }

  return { session: null, messages: [] };
}

export async function updateChatStatusAction(
  sessionId: string,
  status: "bot" | "human" | "resolved"
): Promise<{ success: boolean; message?: string }> {
  // Fails closed. The previous check only enforced auth when
  // NODE_ENV === "production", which is not a reliable signal on Cloudflare
  // Workers and therefore allowed unauthenticated mutation in production.
  await requireAdmin();

  const now = new Date().toISOString();

  // In-memory update
  const mem = getMemorySessionById(sessionId);
  if (mem) {
    mem.status = status;
    mem.updated_at = now;
    saveMemorySession(mem);
  }

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      await supabaseAdmin
        .from("chat_sessions")
        .update({ status, updated_at: now })
        .eq("id", sessionId);
    } catch (err) {
      console.warn("Supabase status update error:", err);
    }
  }

  try {
    revalidatePath("/admin/chats");
    revalidatePath(`/admin/chats/${sessionId}`);
  } catch {}

  return { success: true };
}

export async function sendAdminReplyAction(
  sessionId: string,
  content: string
): Promise<{ success: boolean; message?: AdminChatMessage; error?: string }> {
  // Fails closed — see updateChatStatusAction above.
  const auth = await requireAdmin();

  const now = new Date().toISOString();
  const adminMsg: AdminChatMessage = {
    id: `msg-${Date.now()}-adm`,
    session_id: sessionId,
    sender: "admin",
    content: content.trim(),
    metadata: {
      adminEmail: auth.email,
    },
    created_at: now,
  };

  addMemoryMessage(adminMsg);

  const mem = getMemorySessionById(sessionId);
  if (mem) {
    mem.status = "human";
    mem.last_message = content.trim();
    mem.last_message_at = now;
    mem.unread_visitor_count = (mem.unread_visitor_count || 0) + 1;
    mem.unread_admin_count = 0;
    saveMemorySession(mem);
  }

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      await supabaseAdmin.from("chat_messages").insert([
        {
          session_id: sessionId,
          sender: "admin",
          content: content.trim(),
          metadata: adminMsg.metadata,
        },
      ]);

      await supabaseAdmin
        .from("chat_sessions")
        .update({
          status: "human",
          last_message: content.trim(),
          last_message_at: now,
          unread_admin_count: 0,
          unread_visitor_count: (mem?.unread_visitor_count || 1),
          updated_at: now,
        })
        .eq("id", sessionId);
    } catch (dbErr) {
      console.warn("Supabase admin reply error:", dbErr);
    }
  }

  try {
    revalidatePath("/admin/chats");
    revalidatePath(`/admin/chats/${sessionId}`);
  } catch {}

  return { success: true, message: adminMsg };
}
