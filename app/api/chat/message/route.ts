import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { processChatFlow, ChatFlowState } from "@/lib/chat-flow";
import {
  getOrCreateSession,
  saveMemorySession,
  addMemoryMessage,
  InMemoryChatMessage,
} from "@/lib/chat-store";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const visitorId = (body.visitorId || "").trim();
    const content = (body.message || body.content || "").trim();

    if (!visitorId || !content) {
      return NextResponse.json(
        { success: false, error: "visitorId and message (or content) are required" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const session = await getOrCreateSession(visitorId);

    // 1. Record Visitor Message
    const visitorMsgId = `msg-${Date.now()}-vis`;
    const visitorMsg: InMemoryChatMessage = {
      id: visitorMsgId,
      session_id: session.id,
      sender: "visitor",
      content,
      metadata: {},
      created_at: now,
    };
    addMemoryMessage(visitorMsg);

    if (isSupabaseConfigured && supabaseAdmin) {
      try {
        await supabaseAdmin.from("chat_messages").insert([
          {
            session_id: session.id,
            sender: "visitor",
            content,
            metadata: {},
          },
        ]);

        await supabaseAdmin
          .from("chat_sessions")
          .update({
            last_message: content,
            last_message_at: now,
            unread_admin_count: (session.unread_admin_count || 0) + 1,
            updated_at: now,
          })
          .eq("id", session.id);
      } catch (dbErr) {
        console.warn("Failed recording message to Supabase:", dbErr);
      }
    }

    // Update in-memory session
    session.last_message = content;
    session.last_message_at = now;
    session.unread_admin_count = (session.unread_admin_count || 0) + 1;
    saveMemorySession(session);

    const returnedMessages: InMemoryChatMessage[] = [visitorMsg];

    // 2. Automated Bot Reply if session is in 'bot' mode
    if (session.status === "bot") {
      const currentState = (session.metadata || { currentMenu: "main" }) as ChatFlowState;
      const flowResult = processChatFlow(content, currentState);

      const botNow = new Date().toISOString();
      const botMsgId = `msg-${Date.now()}-bot`;
      const botMsg: InMemoryChatMessage = {
        id: botMsgId,
        session_id: session.id,
        sender: "bot",
        content: flowResult.reply,
        metadata: {
          quickReplies: flowResult.quickReplies,
        },
        created_at: botNow,
      };
      addMemoryMessage(botMsg);
      returnedMessages.push(botMsg);

      // Handle captured lead
      if (flowResult.isLeadCaptured && flowResult.leadData?.email) {
        const lead = flowResult.leadData;
        session.visitor_email = lead.email;
        session.visitor_name = lead.name || session.visitor_name;
        session.visitor_phone = lead.phone || session.visitor_phone;

        if (isSupabaseConfigured && supabaseAdmin) {
          try {
            await supabaseAdmin.from("leads").insert([
              {
                name: lead.name || "Chat Lead",
                email: lead.email,
                phone: lead.phone || "+971-Chat",
                company: lead.company || "Website Chat",
                service: lead.service || "chatbots",
                message: `Lead captured via Website Chat Widget: "${content}"`,
                status: "new",
                source: "website_chat",
                metadata: {
                  session_id: session.id,
                  visitor_id: visitorId,
                },
              },
            ]);
          } catch (leadDbErr) {
            console.warn("Failed saving chat lead to Supabase:", leadDbErr);
          }
        }

        // Email notification via Resend
        const resendKey = process.env.RESEND_API_KEY;
        const adminEmail = process.env.ADMIN_EMAIL || "zaminaskari.work@gmail.com";
        if (resendKey && !resendKey.includes("YOUR_") && !resendKey.includes("placeholder")) {
          try {
            const resend = new Resend(resendKey);
            await resend.emails.send({
              from: process.env.FROM_EMAIL || "NeuralWaves Chat <leads@neuralwaves.in>",
              to: [adminEmail],
              subject: `🔥 New Inbound Chat Lead: ${lead.email}`,
              text: `A visitor just converted via the website chat widget!\n\nEmail: ${lead.email}\nPhone: ${lead.phone || "Not provided"}\nMessage: ${content}\nVisitor ID: ${visitorId}\nSession ID: ${session.id}`,
            });
          } catch (emailErr) {
            console.warn("Failed sending email notification:", emailErr);
          }
        }
      }

      // If user requested human handoff
      if (flowResult.wantsHuman) {
        session.status = "human";
      }

      session.metadata = flowResult.newState as unknown as Record<string, unknown>;
      session.last_message = flowResult.reply;
      session.last_message_at = botNow;
      saveMemorySession(session);

      if (isSupabaseConfigured && supabaseAdmin) {
        try {
          await supabaseAdmin.from("chat_messages").insert([
            {
              session_id: session.id,
              sender: "bot",
              content: flowResult.reply,
              metadata: { quickReplies: flowResult.quickReplies },
            },
          ]);

          await supabaseAdmin
            .from("chat_sessions")
            .update({
              status: session.status,
              visitor_email: session.visitor_email,
              visitor_name: session.visitor_name,
              visitor_phone: session.visitor_phone,
              metadata: session.metadata,
              last_message: flowResult.reply,
              last_message_at: botNow,
              unread_visitor_count: (session.unread_visitor_count || 0) + 1,
              updated_at: botNow,
            })
            .eq("id", session.id);
        } catch (dbErr) {
          console.warn("Failed saving bot response to Supabase:", dbErr);
        }
      }
    }

    return NextResponse.json({
      success: true,
      session,
      messages: returnedMessages,
    });
  } catch (error: unknown) {
    console.error("Chat message error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
