import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { insertLead } from "@/lib/data/leads";
import {
  buildInboundAcknowledgement,
  isWhatsAppSendConfigured,
  sendWhatsAppText,
} from "@/lib/whatsapp/send";

export const dynamic = "force-dynamic";

/**
 * Meta WhatsApp Business Cloud API webhook.
 *
 * SECURITY: POST requests are authenticated with Meta's X-Hub-Signature-256 HMAC
 * computed over the raw request body. The previous implementation verified
 * nothing, so anyone could POST a forged `whatsapp_business_account` payload and
 * write contacts, conversations and pipeline leads with the service-role key.
 *
 * The hub.verify_token no longer has a hardcoded fallback: the literal that used
 * to live here was also committed to .env.example, so it was public.
 */

/**
 * Constant-time comparison of Meta's HMAC signature.
 * Must be computed over the RAW body — re-serialising parsed JSON changes bytes.
 */
function verifyMetaSignature(rawBody: string, header: string | null): boolean {
  const appSecret = process.env.META_APP_SECRET?.trim();

  if (!appSecret) {
    console.error(
      "[whatsapp] META_APP_SECRET is not set — rejecting webhook. Set it from the Meta app dashboard (Settings -> Basic -> App Secret)."
    );
    return false;
  }

  if (!header || !header.startsWith("sha256=")) return false;

  const expected = crypto.createHmac("sha256", appSecret).update(rawBody, "utf8").digest();
  const receivedHex = header.slice("sha256=".length);

  if (!/^[0-9a-f]+$/i.test(receivedHex)) return false;

  const received = Buffer.from(receivedHex, "hex");
  if (received.length !== expected.length) return false;

  return crypto.timingSafeEqual(expected, received);
}

/** Constant-time string comparison for the verification token. */
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * GET: Meta webhook verification handshake.
 */
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token") ?? "";
  const challenge = searchParams.get("hub.challenge");

  const verifyToken = process.env.VERIFY_TOKEN?.trim();

  if (!verifyToken) {
    console.error("[whatsapp] VERIFY_TOKEN is not set — cannot complete verification.");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  if (mode === "subscribe" && token && safeEqual(token, verifyToken)) {
    return new NextResponse(challenge, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  return NextResponse.json({ error: "Forbidden: Verification token mismatch" }, { status: 403 });
}

/**
 * POST: inbound messages and status updates.
 */
export async function POST(req: NextRequest) {
  // 1. Authenticate the caller BEFORE parsing or acting on the payload.
  const rawBody = await req.text();
  if (!verifyMetaSignature(rawBody, req.headers.get("x-hub-signature-256"))) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(rawBody) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    // 2. Read the object shape Meta sends.
    if (body.object !== "whatsapp_business_account") {
      return NextResponse.json({ status: "ignored" }, { status: 200 });
    }

    const entry = (body.entry as Array<Record<string, unknown>> | undefined)?.[0];
    const changes = (entry?.changes as Array<Record<string, unknown>> | undefined)?.[0];
    const value = changes?.value as Record<string, unknown> | undefined;
    const messages = value?.messages as Array<Record<string, unknown>> | undefined;

    if (!messages || messages.length === 0) {
      return NextResponse.json({ status: "no_messages" }, { status: 200 });
    }

    const message = messages[0];
    const waMessageId = String(message.id ?? "");
    const fromWaId = String(message.from ?? "");

    if (!fromWaId) {
      return NextResponse.json({ status: "ignored" }, { status: 200 });
    }

    const contacts = value?.contacts as Array<{ profile?: { name?: string } }> | undefined;
    const contactName = contacts?.[0]?.profile?.name || "WhatsApp Client";

    const text = message.text as { body?: string } | undefined;
    const interactive = message.interactive as
      | { button_reply?: { title?: string }; list_reply?: { title?: string } }
      | undefined;
    const messageText =
      message.type === "text"
        ? text?.body
        : message.type === "interactive"
          ? interactive?.button_reply?.title || interactive?.list_reply?.title
          : `[Attachment: ${String(message.type)}]`;

    const client = isSupabaseConfigured && supabaseAdmin ? supabaseAdmin : null;

    // 3. Idempotency: Meta retries deliveries, so dedupe on the WA message id.
    if (client && waMessageId) {
      const { data: existing, error: dedupeError } = await client
        .from("messages")
        .select("id")
        .eq("raw_payload->>id", waMessageId)
        .limit(1);

      if (dedupeError) console.error("[whatsapp] dedupe check failed:", dedupeError.message);
      if (existing && existing.length > 0) {
        return NextResponse.json({ status: "duplicate_ignored" }, { status: 200 });
      }
    }

    let convId: string | null = null;

    if (client) {
      // 4. Upsert contact
      const { data: contact, error: contactError } = await client
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

      if (contactError) console.error("[whatsapp] contact upsert failed:", contactError.message);

      if (contact) {
        // 5. Find or create the conversation
        const { data: existingConv, error: convLookupError } = await client
          .from("conversations")
          .select("id")
          .eq("contact_id", contact.id)
          .eq("status", "active")
          .maybeSingle();

        if (convLookupError) {
          console.error("[whatsapp] conversation lookup failed:", convLookupError.message);
        }

        if (existingConv) {
          convId = existingConv.id as string;
          const { error } = await client
            .from("conversations")
            .update({ last_message_at: new Date().toISOString() })
            .eq("id", convId);
          if (error) console.error("[whatsapp] conversation touch failed:", error.message);
        } else {
          const { data: newConv, error: convInsertError } = await client
            .from("conversations")
            .insert({ contact_id: contact.id, channel: "whatsapp", status: "active" })
            .select("id")
            .single();
          if (convInsertError) {
            console.error("[whatsapp] conversation insert failed:", convInsertError.message);
          }
          if (newConv) convId = newConv.id as string;
        }

        // 6. Store the inbound message (also the idempotency record).
        if (convId) {
          const { error } = await client.from("messages").insert({
            conversation_id: convId,
            sender_type: "user",
            content: messageText || "",
            raw_payload: message,
          });
          if (error) console.error("[whatsapp] message insert failed:", error.message);
        }

        // 7. Register the enquiry as a lead.
        //    email is intentionally null — the previous code fabricated
        //    `<wa_id>@wa.neuralwaves.in`, an undeliverable address that polluted
        //    the CRM and could never accept mail.
        const leadResult = await insertLead({
          name: contactName,
          email: null,
          phone: `+${fromWaId}`,
          service: "chatbots",
          message: messageText || "Initiated WhatsApp inquiry",
          status: "new",
          source: "whatsapp_cloud_api",
          metadata: { wa_id: fromWaId, wa_message_id: waMessageId },
        });
        if (!leadResult.success) {
          console.error("[whatsapp] lead insert failed:", leadResult.error);
        }
      }
    }

    // 8. Reply. Previously nothing was ever sent back — the advertised bot was
    //    receive-only. Skipped when outbound is not configured.
    if (isWhatsAppSendConfigured()) {
      const ackBody = buildInboundAcknowledgement(contactName);
      const ack = await sendWhatsAppText(fromWaId, ackBody);

      if (!ack.success) {
        console.error("[whatsapp] acknowledgement not delivered:", ack.error);
      } else if (client && convId) {
        // Record the outbound reply so the admin thread shows both sides.
        const { error } = await client.from("messages").insert({
          conversation_id: convId,
          sender_type: "bot",
          content: ackBody,
          raw_payload: { direction: "outbound", wa_message_id: ack.messageId },
        });
        if (error) console.error("[whatsapp] outbound message record failed:", error.message);
      }
    }

    // Return 200 so Meta does not retry unnecessarily.
    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (error: unknown) {
    console.error("[whatsapp] webhook handling error:", error);
    // Return 200 to prevent Meta from retrying indefinitely.
    return NextResponse.json({ status: "error_handled" }, { status: 200 });
  }
}
