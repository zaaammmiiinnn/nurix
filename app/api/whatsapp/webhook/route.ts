import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

/**
 * GET handler: Meta WhatsApp Cloud API Webhook Verification handshake.
 * Meta sends hub.mode, hub.verify_token, and hub.challenge.
 */
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const verifyToken = process.env.VERIFY_TOKEN || "neuralwaves_wa_secret_verify_token_2026";

  if (mode === "subscribe" && token === verifyToken) {
    return new NextResponse(challenge, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  return NextResponse.json({ error: "Forbidden: Verification token mismatch" }, { status: 403 });
}

/**
 * POST handler: Inbound messages & status updates from Meta WhatsApp Cloud API.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Verify it's a WhatsApp webhook payload
    if (body.object !== "whatsapp_business_account") {
      return NextResponse.json({ status: "ignored" }, { status: 200 });
    }

    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const messages = value?.messages;

    if (!messages || messages.length === 0) {
      return NextResponse.json({ status: "no_messages" }, { status: 200 });
    }

    const message = messages[0];
    const fromWaId = message.from; // Sender phone number
    const contactName = value?.contacts?.[0]?.profile?.name || "WhatsApp Client";
    const messageText =
      message.type === "text"
        ? message.text?.body
        : message.type === "interactive"
        ? message.interactive?.button_reply?.title || message.interactive?.list_reply?.title
        : `[Attachment: ${message.type}]`;

    // If Supabase is configured, record to contacts, conversations, and messages
    if (isSupabaseConfigured && supabaseAdmin) {
      try {
        // 1. Upsert contact
        const { data: contact } = await supabaseAdmin
          .from("contacts")
          .upsert(
            {
              wa_id: fromWaId,
              name: contactName,
              phone: fromWaId,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "wa_id" }
          )
          .select("id")
          .single();

        if (contact) {
          // 2. Find or create conversation
          let convId: string | null = null;
          const { data: existingConv } = await supabaseAdmin
            .from("conversations")
            .select("id")
            .eq("contact_id", contact.id)
            .eq("status", "active")
            .maybeSingle();

          if (existingConv) {
            convId = existingConv.id;
            await supabaseAdmin
              .from("conversations")
              .update({ last_message_at: new Date().toISOString() })
              .eq("id", convId);
          } else {
            const { data: newConv } = await supabaseAdmin
              .from("conversations")
              .insert({
                contact_id: contact.id,
                channel: "whatsapp",
                status: "active",
              })
              .select("id")
              .single();
            if (newConv) convId = newConv.id;
          }

          // 3. Insert incoming message
          if (convId) {
            await supabaseAdmin.from("messages").insert({
              conversation_id: convId,
              sender_type: "user",
              content: messageText || "",
              raw_payload: message,
            });
          }

          // 4. Also register as a pipeline lead if high intent or new contact
          await supabaseAdmin.from("leads").insert({
            name: contactName,
            email: `${fromWaId}@wa.neuralwaves.in`,
            phone: `+${fromWaId}`,
            service: "chatbots",
            message: messageText || "Initiated WhatsApp inquiry",
            status: "new",
            metadata: {
              source: "whatsapp_cloud_api",
              wa_id: fromWaId,
            },
          });
        }
      } catch (dbErr) {
        console.error("Failed to store WhatsApp message in Supabase:", dbErr);
      }
    }

    // Return 200 immediately to Meta
    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (error: unknown) {
    console.error("WhatsApp Webhook POST Error:", error);
    // Always return 200 to prevent Meta from retrying indefinitely
    return NextResponse.json({ status: "error_handled" }, { status: 200 });
  }
}
