"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/server";
import { createManualLead } from "@/app/admin/leads/actions";

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
};

/**
 * Server Action to submit a lead from the contact form:
 * 1. Reads Form Data
 * 2. Honeypot check (hidden field 'website')
 * 3. Zod validation
 * 4. Inserts into Supabase `leads` table
 * 5. Sends notification email via Resend to process.env.ADMIN_EMAIL
 * 6. Returns { success: true } or { success: false, error }
 */
export async function submitLead(formData: FormData): Promise<SubmitLeadResult> {
  try {
    // 1. Honeypot check for spam bots
    const website = (formData.get("website") as string) || "";
    if (website && website.trim().length > 0) {
      // Silently succeed to trick automated spam bots
      return { success: true };
    }

    // 2. Extract values from FormData
    const rawData = {
      name: (formData.get("name") as string) || "",
      email: (formData.get("email") as string) || "",
      phone: (formData.get("phone") as string) || "",
      company: (formData.get("company") as string) || undefined,
      service: (formData.get("service") as string) || "chatbots",
      message: (formData.get("message") as string) || "",
      website,
    };

    // 3. Validate with Zod
    const validated = leadSchema.safeParse(rawData);
    if (!validated.success) {
      const firstError = validated.error.errors[0]?.message || "Validation failed";
      return { success: false, error: firstError };
    }

    const { name, email, phone, company, service, message } = validated.data;

    // 4. Insert into Supabase `leads` table
    let insertedSuccessfully = false;
    try {
      const supabase = createAdminClient();
      const { data, error: dbError } = await supabase
        .from("leads")
        .insert([
          {
            name,
            email,
            phone,
            company: company || null,
            service,
            message,
            status: "new",
          },
        ])
        .select()
        .single();

      if (!dbError && data) {
        insertedSuccessfully = true;
      } else if (dbError) {
        console.warn("[Supabase] Insert lead error, recording via backup store:", dbError.message);
      }
    } catch (dbException) {
      console.warn("[Supabase] Exception connecting to leads table:", dbException);
    }

    // Backup local/fallback store ensure lead is never lost in dev environments
    if (!insertedSuccessfully) {
      await createManualLead({
        name,
        email,
        phone,
        company: company || null,
        service,
        message,
        status: "new",
      });
    }

    // 5. Send notification email via Resend
    const resendApiKey = process.env.RESEND_API_KEY?.trim();
    const adminEmail = process.env.ADMIN_EMAIL?.trim() || "zaminaskari.work@gmail.com";
    const fromEmail = process.env.FROM_EMAIL?.trim() || "onboarding@resend.dev";

    if (
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
