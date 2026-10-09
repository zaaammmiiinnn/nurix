import "server-only";

/**
 * Meta WhatsApp Business Cloud API — outbound messaging.
 *
 * This module did not previously exist: WHATSAPP_TOKEN and PHONE_NUMBER_ID were
 * documented in .env.example but never read anywhere, and there was no call to
 * graph.facebook.com in the repository. The webhook ingested messages and then
 * never replied, so the advertised "WhatsApp bot" was receive-only.
 */

const GRAPH_VERSION = "v21.0";

export interface SendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/** True when outbound WhatsApp is actually configured. */
export function isWhatsAppSendConfigured(): boolean {
  return Boolean(
    process.env.WHATSAPP_TOKEN?.trim() && process.env.PHONE_NUMBER_ID?.trim()
  );
}

/**
 * Send a plain text WhatsApp message.
 * Returns an explicit failure instead of silently doing nothing.
 */
export async function sendWhatsAppText(to: string, body: string): Promise<SendResult> {
  const token = process.env.WHATSAPP_TOKEN?.trim();
  const phoneNumberId = process.env.PHONE_NUMBER_ID?.trim();

  if (!token || !phoneNumberId) {
    return {
      success: false,
      error: "WhatsApp outbound not configured (set WHATSAPP_TOKEN and PHONE_NUMBER_ID).",
    };
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to,
          type: "text",
          text: { preview_url: false, body },
        }),
      }
    );

    const payload = (await res.json().catch(() => null)) as
      | { messages?: Array<{ id?: string }>; error?: { message?: string } }
      | null;

    if (!res.ok) {
      const message = payload?.error?.message || `HTTP ${res.status}`;
      console.error("[whatsapp] send failed:", message);
      return { success: false, error: message };
    }

    return { success: true, messageId: payload?.messages?.[0]?.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[whatsapp] send threw:", message);
    return { success: false, error: message };
  }
}

/**
 * First-touch acknowledgement for an inbound enquiry.
 * Deliberately factual — do not promise capabilities the system does not have.
 */
export function buildInboundAcknowledgement(contactName?: string): string {
  const greeting = contactName && contactName !== "WhatsApp Client" ? `Hi ${contactName}! ` : "Hi! ";
  return (
    `${greeting}Thanks for messaging NeuralWaves.\n\n` +
    `We've received your message and an engineer will reply here shortly.\n\n` +
    `If it's urgent, you can also email us directly. We typically respond within a few hours during Dubai business hours.`
  );
}
