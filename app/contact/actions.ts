"use server";

import { Resend } from "resend";
import { insertLead } from "@/lib/data/leads";
import { contactSchema, type ContactFormData } from "@/lib/schemas/contact";

// Simple in-memory rate limiting map: ip -> last timestamp
const rateLimitMap = new Map<string, number>();

export async function submitContactForm(data: ContactFormData) {
  try {
    // 1. Honeypot check (silent drop for spam bots)
    if (data.honeypot && data.honeypot.trim().length > 0) {
      return { success: true, message: "Got it. We'll reply within 4 hours." };
    }

    // 2. Validate input with Zod
    const validated = contactSchema.safeParse(data);
    if (!validated.success) {
      const fieldErrors = validated.error.flatten().fieldErrors;
      return {
        success: false,
        errors: fieldErrors,
        message: "Please check the highlighted fields.",
      };
    }

    const { name, email, phone, company, service, message } = validated.data;

    // 3. Rate limiting check (min 10 seconds between requests for same email/phone)
    const key = `${email}:${phone}`;
    const now = Date.now();
    const lastRequest = rateLimitMap.get(key);
    if (lastRequest && now - lastRequest < 10000) {
      return {
        success: false,
        message: "Too many submissions. Please wait a moment before trying again.",
      };
    }
    rateLimitMap.set(key, now);

    // 4. Save to Supabase `leads`. If the write fails we must NOT tell the
    //    visitor it succeeded — the previous code discarded the result.
    const insertResult = await insertLead({
      name,
      email,
      phone,
      company: company || null,
      service,
      message,
      status: "new",
      source: "website_contact",
    });

    if (!insertResult.success) {
      return {
        success: false,
        message:
          "We couldn't save your message. Please try again, or reach us on WhatsApp.",
      };
    }

    // 5. Send notification email via Resend if API key is present
    const resendKey = process.env.RESEND_API_KEY?.trim();
    if (resendKey && !resendKey.includes("YOUR_KEY") && !resendKey.includes("re_example")) {
      try {
        const resend = new Resend(resendKey);
        const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
        const toEmail = process.env.RESEND_TO_EMAIL || process.env.ADMIN_EMAIL;
        if (!toEmail) {
          console.warn(
            "[contact] Lead saved but no notification email sent: set RESEND_TO_EMAIL or ADMIN_EMAIL."
          );
          return { success: true, message: "Got it. We'll reply within 4 hours." };
        }

        await resend.emails.send({
          from: fromEmail,
          to: toEmail,
          subject: `[New Lead] ${name} - ${service.toUpperCase()}`,
          text: `New lead from website contact form:

Name: ${name}
Email: ${email}
Phone: ${phone}
Company: ${company || "Not provided"}
Service: ${service}

Message:
${message}
          `,
        });
      } catch (err) {
        console.error("Resend send error:", err);
      }
    }

    return {
      success: true,
      message: "Got it. We'll reply within 4 hours.",
    };
  } catch (error) {
    console.error("Contact form submission error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try contacting us via WhatsApp.",
    };
  }
}
