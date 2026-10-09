import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export interface InMemoryChatSession {
  id: string;
  visitor_id: string;
  status: "bot" | "human" | "resolved";
  visitor_name?: string;
  visitor_email?: string;
  visitor_phone?: string;
  visitor_company?: string;
  metadata: Record<string, unknown>;
  unread_admin_count: number;
  unread_visitor_count: number;
  last_message: string;
  last_message_at: string;
  created_at: string;
  updated_at: string;
}

export interface InMemoryChatMessage {
  id: string;
  session_id: string;
  sender: "visitor" | "bot" | "admin";
  content: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

// In-memory cache for fast access & offline/placeholder fallback
const memorySessions = new Map<string, InMemoryChatSession>();
const memoryMessages = new Map<string, InMemoryChatMessage[]>();

export function getMemorySessions(): InMemoryChatSession[] {
  return Array.from(memorySessions.values()).sort(
    (a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()
  );
}

export function getMemorySessionById(id: string): InMemoryChatSession | undefined {
  return memorySessions.get(id);
}

export function getMemorySessionByVisitorId(visitorId: string): InMemoryChatSession | undefined {
  return Array.from(memorySessions.values()).find((session) => session.visitor_id === visitorId);
}

export function saveMemorySession(session: InMemoryChatSession): void {
  memorySessions.set(session.id, session);
}

export function getMemoryMessages(sessionId: string): InMemoryChatMessage[] {
  return (memoryMessages.get(sessionId) || []).sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
}

export function addMemoryMessage(msg: InMemoryChatMessage): void {
  const existing = memoryMessages.get(msg.session_id) || [];
  memoryMessages.set(msg.session_id, [...existing, msg]);
}

/**
 * Loads or creates a chat session for a given visitorId.
 */
export async function getOrCreateSession(visitorId: string): Promise<InMemoryChatSession> {
  const now = new Date().toISOString();

  if (isSupabaseConfigured && supabaseAdmin) {
    try {
      const { data: existing, error } = await supabaseAdmin
        .from("chat_sessions")
        .select("*")
        .eq("visitor_id", visitorId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && existing) {
        saveMemorySession(existing as InMemoryChatSession);
        return existing as InMemoryChatSession;
      }

      // Create new in Supabase
      const newSessionPayload = {
        visitor_id: visitorId,
        status: "bot",
        metadata: { currentMenu: "main" },
        unread_admin_count: 0,
        unread_visitor_count: 0,
        last_message: "Chat initiated",
        last_message_at: now,
      };

      const { data: created, error: createError } = await supabaseAdmin
        .from("chat_sessions")
        .insert([newSessionPayload])
        .select()
        .single();

      if (!createError && created) {
        saveMemorySession(created as InMemoryChatSession);
        return created as InMemoryChatSession;
      }
    } catch (err) {
      console.warn("Supabase chat_sessions access failed, using in-memory:", err);
    }
  }

  // In-memory fallback
  const existingMemory = getMemorySessionByVisitorId(visitorId);
  if (existingMemory) {
    return existingMemory;
  }

  const newSession: InMemoryChatSession = {
    id: `sess-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    visitor_id: visitorId,
    status: "bot",
    metadata: { currentMenu: "main" },
    unread_admin_count: 0,
    unread_visitor_count: 0,
    last_message: "Welcome to NeuralWaves AI Studio",
    last_message_at: now,
    created_at: now,
    updated_at: now,
  };

  saveMemorySession(newSession);
  return newSession;
}
