import { z } from "zod";

// Validates international numbers (E.164: 7 to 15 digits) or UAE local numbers
const phoneCleanRegex = /^\+?[0-9]{7,15}$/;

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .transform((val) => val.replace(/[\s\-\(\)]/g, ""))
    .refine((val) => phoneCleanRegex.test(val), {
      message:
        "Please enter a valid phone or WhatsApp number (e.g., +971 50 123 4567 or +91 98765 43210)",
    }),
  company: z.string().max(100).optional().or(z.literal("")),
  service: z.enum(["chatbots", "dashboards", "agents", "not_sure"], {
    errorMap: () => ({ message: "Please select a service" }),
  }),
  message: z
    .string()
    .min(10, "Please provide a brief description (at least 10 characters)")
    .max(2000),
  honeypot: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;
