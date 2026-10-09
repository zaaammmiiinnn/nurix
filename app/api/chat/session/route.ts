import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { MAIN_MENU_TEXT, MAIN_QUICK_REPLIES } from "@/lib/chat-flow";
import {
  getOrCreateSession,
  getMemoryMessages,
  addMemoryMessage,
  saveMemorySession,
  InMemoryChatMessage,
} from "@/lib/chat-store";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const visitorId = (searchParams.get("visitorId") || "").trim();

    if (!visitorId) {
      return NextResponse.json(
        { success: false, error: "visitorId query parameter is required" },
        { status: 400 }
      );
    }

    const session = await getOrCreateSession(visitorId);
    let messages: InMemoryChatMessage[] = [];

    if (isSupabaseConfigured && supabaseAdmin) {
      try {
        const { data, error } = await supabaseAdmin
          .from("chat_messages")
          .select("*")
          .eq("session_id", session.id)
          .order("created_at", { ascending: true });

        if (!error && data) {
          messages = data as InMemoryChatMessage[];
        }
      } catch (err) {
        console.warn("Supabase fetch chat_messages failed:", err);
      }
    }

    // If no messages retrieved from database, fall back to in-memory store
    if (messages.length === 0) {
      messages = getMemoryMessages(session.id);
    }

    // If still zero messages, create the initial welcome bot message
    if (messages.length === 0) {
      const now = new Date().toISOString();
      const welcomeMsg: InMemoryChatMessage = {
        id: `welcome-${Date.now()}`,
        session_id: session.id,
        sender: "bot",
        content: MAIN_MENU_TEXT,
        metadata: {
          quickReplies: MAIN_QUICK_REPLIES,
        },
        created_at: now,
      };

      addMemoryMessage(welcomeMsg);
      messages = [welcomeMsg];

      session.last_message = MAIN_MENU_TEXT;
      session.last_message_at = now;
      saveMemorySession(session);

      if (isSupabaseConfigured && supabaseAdmin) {
        try {
          await supabaseAdmin.from("chat_messages").insert([
            {
              session_id: session.id,
              sender: "bot",
              content: MAIN_MENU_TEXT,
              metadata: { quickReplies: MAIN_QUICK_REPLIES },
            },
          ]);
        } catch {}
      }
    }

    return NextResponse.json({
      success: true,
      session,
      messages,
    });
  } catch (error: unknown) {
    console.error("Chat session error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
