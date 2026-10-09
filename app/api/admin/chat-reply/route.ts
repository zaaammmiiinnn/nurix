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
    // 1. Verify admin access
    const authResult = await verifyAdminAccess();
    if (authResult.status !== "authorized") {
      // Allow fallback if running in development or verified session cookie exists
      const adminCookie = req.cookies.get("admin_session")?.value || req.cookies.get("__session")?.value;
      if (!adminCookie && process.env.NODE_ENV === "production") {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
      }
    }

    const body = await req.json();
    const sessionId = (body.sessionId || "").trim();
    const content = (body.message || "").trim();

    if (!sessionId || !content) {
      return NextResponse.json(
        { success: false, error: "sessionId and message are required" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const adminMsgId = `msg-${Date.now()}-adm`;

    const adminMsg: InMemoryChatMessage = {
      id: adminMsgId,
      session_id: sessionId,
      sender: "admin",
      content,
      metadata: {
        adminEmail: authResult.status === "authorized" ? authResult.email : "Admin Engineer",
      },
      created_at: now,
    };
    addMemoryMessage(adminMsg);

    // Update in-memory session if present
    const memorySession = getMemorySessionById(sessionId);
    if (memorySession) {
      memorySession.status = "human";
      memorySession.last_message = content;
      memorySession.last_message_at = now;
      memorySession.unread_visitor_count = (memorySession.unread_visitor_count || 0) + 1;
      memorySession.unread_admin_count = 0;
      saveMemorySession(memorySession);
    }

    // Persist to Supabase
    if (isSupabaseConfigured && supabaseAdmin) {
      try {
        await supabaseAdmin.from("chat_messages").insert([
          {
            session_id: sessionId,
            sender: "admin",
            content,
            metadata: {
              adminEmail: authResult.status === "authorized" ? authResult.email : "Admin Engineer",
            },
          },
        ]);

        await supabaseAdmin
          .from("chat_sessions")
          .update({
            status: "human",
            last_message: content,
            last_message_at: now,
            unread_admin_count: 0,
            unread_visitor_count: (memorySession?.unread_visitor_count || 1),
            updated_at: now,
          })
          .eq("id", sessionId);
      } catch (dbErr) {
        console.warn("Supabase failed storing admin reply:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: adminMsg,
    });
  } catch (error: unknown) {
    console.error("Admin chat-reply error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
