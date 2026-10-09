import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { verifyAdminAccess } from "@/lib/auth/admin-auth";
import {
  getMemorySessionById,
  saveMemorySession,
  addMemoryMessage,
  InMemoryChatMessage,
} from "@/lib/chat-store";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // Require an authorized administrator. Fails closed.
    // SECURITY: see the note in app/api/admin/chat-reply/route.ts — a bare cookie
    // name must never be treated as proof of authorization.
    const authResult = await verifyAdminAccess();
    if (authResult.status !== "authorized") {
      const status = authResult.status === "unauthenticated" ? 401 : 403;
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status });
    }

    const body = await req.json();
    const sessionId = (body.sessionId || "").trim();
    const newStatus = (body.status || "").trim() as "bot" | "human" | "resolved";

    if (!sessionId || !["bot", "human", "resolved"].includes(newStatus)) {
      return NextResponse.json(
        { success: false, error: "Valid sessionId and status ('bot' | 'human' | 'resolved') required" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const memorySession = getMemorySessionById(sessionId);
    if (memorySession) {
      memorySession.status = newStatus;
      memorySession.updated_at = now;
      saveMemorySession(memorySession);
    }

    // Optional status transition system notice
    let statusNotice = "";
    if (newStatus === "human") {
      statusNotice = "👨‍💻 An engineer has joined this conversation.";
    } else if (newStatus === "bot") {
      statusNotice = "🤖 Switched back to Automated Assistant mode.";
    } else if (newStatus === "resolved") {
      statusNotice = "✅ This conversation has been marked as resolved.";
    }

    if (statusNotice) {
      const noticeMsg: InMemoryChatMessage = {
        id: `notice-${Date.now()}`,
        session_id: sessionId,
        sender: "bot",
        content: statusNotice,
        metadata: { isSystemNotice: true },
        created_at: now,
      };
      addMemoryMessage(noticeMsg);

      if (isSupabaseConfigured && supabaseAdmin) {
        try {
          await supabaseAdmin.from("chat_messages").insert([
            {
              session_id: sessionId,
              sender: "bot",
              content: statusNotice,
              metadata: { isSystemNotice: true },
            },
          ]);
        } catch {}
      }
    }

    if (isSupabaseConfigured && supabaseAdmin) {
      try {
        await supabaseAdmin
          .from("chat_sessions")
          .update({
            status: newStatus,
            updated_at: now,
          })
          .eq("id", sessionId);
      } catch (dbErr) {
        console.warn("Supabase failed updating chat status:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      status: newStatus,
    });
  } catch (error: unknown) {
    console.error("Admin chat-status error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
