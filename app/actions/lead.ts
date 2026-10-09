"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { Resend } from "resend";
import { insertLead } from "@/lib/data/leads";

const leadSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Please provide a valid email address"),
  phone: z.string().trim().min(5, "Please provide a valid phone or WhatsApp number"),
  company: z.string().trim().optional(),
  service: z.string().trim().min(1, "Please select an area of interest"),
  message: z.string().trim().min(5, "Please provide project brief details"),
  website: z.string().optional(),
});

export type SubmitLeadResult = {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

/**
 * Server Action to submit a lead from the contact form:
 * 1. Reads Form Data or Object
 * 2. Honeypot check (hidden field 'website')
 * 3. Zod validation with fieldErrors
 * 4. Inserts into Supabase `leads` table and backup memory store
 * 5. Sends notification email via Resend to process.env.ADMIN_EMAIL
 * 6. Returns { success: true } or { success: false, error, fieldErrors }
 */
export async function submitLead(
  input: FormData | Record<string, unknown>
): Promise<SubmitLeadResult> {
  try {
    const isFormData = typeof FormData !== "undefined" && input instanceof FormData;

    const getValue = (key: string): string => {
      if (isFormData) {
        const val = (input as FormData).get(key);
        return typeof val === "string" ? val : "";
      }
      const val = (input as Record<string, unknown>)[key];
      return typeof val === "string" ? val : "";
    };

    // 1. Honeypot check for spam bots
    const website = getValue("website").trim();
    if (website && website.length > 0) {
      // Silently succeed to trick automated spam bots
      return { success: true };
    }

    // 2. Extract values
    const rawData = {
      name: getValue("name").trim(),
      email: getValue("email").trim(),
      phone: getValue("phone").trim(),
      company: getValue("company").trim() || undefined,
      service: getValue("service").trim() || "chatbots",
      message: getValue("message").trim(),
      website,
    };

    // 3. Validate with Zod
    const validated = leadSchema.safeParse(rawData);
    if (!validated.success) {
      const fieldErrors = validated.error.flatten().fieldErrors;
      const firstError = validated.error.errors[0]?.message || "Validation failed";
      return { success: false, error: firstError, fieldErrors };
    }

    const { name, email, phone, company, service, message } = validated.data;

    // 4. Persist the lead. Never report success on a failed write.
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
        error:
          "We couldn't save your message right now. Please try again, or reach us on WhatsApp.",
      };
    }

    // 5. Send notification email via Resend
    const resendApiKey = process.env.RESEND_API_KEY?.trim();
    const adminEmail = process.env.RESEND_TO_EMAIL?.trim() || process.env.ADMIN_EMAIL?.trim();
    const fromEmail = process.env.RESEND_FROM_EMAIL?.trim() || "onboarding@resend.dev";

    if (
      adminEmail &&
      resendApiKey &&
      !resendApiKey.includes("YOUR_KEY") &&
      !resendApiKey.includes("re_xxxxxxxx")
    ) {
      try {
        const resend = new Resend(resendApiKey);
        await resend.emails.send({
          from: fromEmail,
          to: adminEmail,
          subject: `[New Lead] ${name} - ${service.toUpperCase()}`,
          text: `New lead submitted via website contact form:

Name: ${name}
Email: ${email}
Phone: ${phone}
Company: ${company || "Not provided"}
Service: ${service}
Message: ${message}

Submitted at: ${new Date().toISOString()} (UTC)`,
        });
      } catch (emailErr) {
        console.warn("[Resend] Failed to send email alert:", emailErr);
      }
    }

    // Revalidate admin pages
    try {
      revalidatePath("/admin/leads");
      revalidatePath("/admin");
    } catch {
      // Ignored outside Next.js request context
    }

    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred.";
    return { success: false, error: errorMsg };
  }
}
