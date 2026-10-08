"use server";

import { Resend } from "resend";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
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

    // 4. Save to Supabase `leads` if configured
    if (isSupabaseConfigured && supabaseAdmin) {
      try {
        const { error: dbError } = await supabaseAdmin.from("leads").insert([
          {
            name,
            email,
            phone,
            company: company || null,
            service,
            message,
            source: "website_contact_form",
            created_at: new Date().toISOString(),
          },
        ]);

        if (dbError) {
          console.error("Supabase leads insert error:", dbError);
        }
      } catch (err) {
        console.error("Supabase insert exception:", err);
      }
    } else {
      console.log("Mock lead captured (Supabase not yet configured):", {
        name,
        email,
        phone,
        company,
        service,
        message,
      });
    }

    // 5. Send notification email via Resend if API key is present
    const resendKey = process.env.RESEND_API_KEY?.trim();
    if (resendKey && !resendKey.includes("YOUR_KEY") && !resendKey.includes("re_example")) {
      try {
        const resend = new Resend(resendKey);
        const fromEmail = process.env.RESEND_FROM_EMAIL || "leads@nurix.ae";
        const toEmail = process.env.RESEND_TO_EMAIL || "hello@nurix.ae";

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
