import "server-only";

import {
  SERVICES_DATA,
  PROJECTS_DATA,
  PRICING_TIERS_DATA,
  FAQS_DATA,
  SITE_CONFIG,
  type ServiceItem,
  type ProjectItem,
  type PricingTier,
  type FaqItem,
} from "./site-data";
import { supabaseAdmin, supabase } from "@/lib/supabase";

/**
 * Public content reads.
 *
 * IMPORTANT: this module must read the database directly. It previously imported
 * the admin action functions (one module per admin section under app/admin),
 * which meant (a) every admin server-action id was reachable from public routes,
 * and (b) adding an authorization guard to those admin functions would have
 * broken the public site. Public reads and admin mutations are now separate.
 *
 * This module is server-only (it uses the service-role client). Never import it
 * from a client component.
 *
 * Behaviour: if Supabase is unreachable or returns no rows, we fall back to the
 * static copy in lib/data/site-data.ts so the marketing site never renders
 * empty. This is intentional for public content.
 */

export interface TestimonialItem {
  id?: string;
  clientName: string;
  clientRole: string;
  company: string;
  content: string;
  avatarUrl?: string;
  rating: number;
}

const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    clientName: "Tariq Al Mansoori",
    clientRole: "Managing Director",
    company: "Skyline Luxury Realty (Dubai)",
    content:
      "NeuralWaves deployed our Palm Jumeirah WhatsApp bot in 4 days. Lead response time dropped from 45 minutes to under 30 seconds. We closed 3 villa transactions within the first 3 weeks.",
    rating: 5,
  },
  {
    clientName: "Omar Al Qasimi",
    clientRole: "Operations Head",
    company: "Karak & Co. Cloud Kitchens",
    content:
      "The dispatch dashboard replaced 4 WhatsApp groups and 2 spreadsheets. Orders route directly to kitchen displays in under 2 seconds. Saved our team 3+ hours every single shift.",
    rating: 5,
  },
  {
    clientName: "Sarah Jenkins",
    clientRole: "Head of Procurement",
    company: "Apex Maritime Logistics (JAFZA)",
    content:
      "Autonomous lead and tender scraping agent running 24/7. Brings qualified port clearances directly into our pipeline before our competitors even notice them.",
    rating: 5,
  },
];

const DEFAULT_SETTINGS: Record<string, string> = {
  whatsapp_number: SITE_CONFIG.contact.whatsapp,
  contact_email: SITE_CONFIG.contact.email,
  contact_phone: SITE_CONFIG.contact.phone,
  calendar_url: SITE_CONFIG.contact.calUrl,
  social_linkedin: SITE_CONFIG.socials.linkedin,
  studio_address: `${SITE_CONFIG.address.streetAddress}, ${SITE_CONFIG.address.addressLocality}, ${SITE_CONFIG.location}`,
};

function db() {
  return supabaseAdmin || supabase;
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? (value as string[]) : [];
}

/**
 * Fetch all active services from Supabase, falling back to static content.
 */
export async function getServices(): Promise<ServiceItem[]> {
  const client = db();
  if (client) {
    try {
      const { data, error } = await client
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((item, idx) => {
          const staticMatch = SERVICES_DATA.find((s) => s.slug === item.slug);
          return {
            number: String(idx + 1).padStart(2, "0"),
            slug: item.slug,
            title: item.title,
            tagline: item.tagline || "",
            description: item.description || "",
            longDescription: item.description || "",
            deliverables: asStringArray(item.features),
            pricing: item.pricing || "From AED 1,500",
            pricingNumeric: staticMatch?.pricingNumeric ?? 1500,
            delivery: item.delivery_days || "3–5 days",
            waText: `Hi NeuralWaves, I want to discuss ${item.title}`,
            benefits: staticMatch?.benefits ?? [],
            idealFor: staticMatch?.idealFor ?? [],
          };
        });
      }
      if (error) {
        console.warn("[DB] services query failed, using static fallback:", error.message);
      }
    } catch (e) {
      console.warn("[DB] services query threw, using static fallback:", e);
    }
  }
  return SERVICES_DATA;
}

/**
 * Fetch a single service by slug.
 */
export async function getServiceBySlug(slug: string): Promise<ServiceItem | null> {
  const services = await getServices();
  return services.find((s) => s.slug === slug) || null;
}

/**
 * Fetch all published projects from Supabase, falling back to static content.
 */
export async function getProjects(): Promise<ProjectItem[]> {
  const client = db();
  if (client) {
    try {
      const { data, error } = await client
        .from("projects")
        .select("*")
        .eq("is_published", true)
        .order("sort_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((item) => ({
          slug: item.slug,
          title: item.title,
          client: item.client || "",
          sector: item.sector || "",
          tag: item.tag || "",
          resultMetric: item.result_metric || "",
          overview: item.overview || "",
          problem: item.problem || "",
          solution: item.solution || "",
          techStack: asStringArray(item.tech_stack),
          isDemo: Boolean(item.is_demo),
          isFeatured: Boolean(item.is_featured),
          deliveryDays: item.delivery_days || "5 days",
        }));
      }
      if (error) {
        console.warn("[DB] projects query failed, using static fallback:", error.message);
      }
    } catch (e) {
      console.warn("[DB] projects query threw, using static fallback:", e);
    }
  }
  return PROJECTS_DATA;
}

/**
 * Fetch featured projects for the homepage.
 */
export async function getFeaturedProjects(): Promise<ProjectItem[]> {
  const allProjects = await getProjects();
  const featured = allProjects.filter((p) => p.isFeatured);
  return featured.length > 0 ? featured : allProjects.slice(0, 3);
}

/**
 * Fetch a single project by slug.
 */
export async function getProjectBySlug(slug: string): Promise<ProjectItem | null> {
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug) || null;
}

/**
 * Fetch pricing tiers from Supabase, falling back to static content.
 * This is the single source of truth for pricing shown anywhere on the site.
 */
export async function getPricingTiers(): Promise<PricingTier[]> {
  const client = db();
  if (client) {
    try {
      const { data, error } = await client
        .from("pricing_tiers")
        .select("*")
        .order("sort_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((item) => ({
          name: item.name,
          price: item.price,
          priceNumeric: item.price_numeric ? Number(item.price_numeric) : 1500,
          description: item.description || "",
          deliveryTimeframe: item.delivery_timeframe || "",
          features: asStringArray(item.features),
          ctaLabel: item.cta_label || "Get started",
          isFeatured: Boolean(item.is_featured),
        }));
      }
      if (error) {
        console.warn("[DB] pricing_tiers query failed, using static fallback:", error.message);
      }
    } catch (e) {
      console.warn("[DB] pricing_tiers query threw, using static fallback:", e);
    }
  }
  return PRICING_TIERS_DATA;
}

/**
 * Fetch active FAQs from Supabase, falling back to static content.
 */
export async function getFaqs(
  category?: "general" | "pricing" | "technical"
): Promise<FaqItem[]> {
  const client = db();
  if (client) {
    try {
      const { data, error } = await client
        .from("faqs")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (!error && data && data.length > 0) {
        const mapped = data
          .filter((item) => !category || (item.category || "").toLowerCase() === category.toLowerCase())
          .map((item) => ({
            question: item.question,
            answer: item.answer,
            category: (item.category || "general") as FaqItem["category"],
          }));
        if (mapped.length > 0) return mapped;
      }
      if (error) {
        console.warn("[DB] faqs query failed, using static fallback:", error.message);
      }
    } catch (e) {
      console.warn("[DB] faqs query threw, using static fallback:", e);
    }
  }
  return category ? FAQS_DATA.filter((f) => f.category === category) : FAQS_DATA;
}

/**
 * Fetch active testimonials from Supabase, falling back to the bundled defaults.
 */
export async function getTestimonials(): Promise<TestimonialItem[]> {
  const client = db();
  if (client) {
    try {
      const { data, error } = await client
        .from("testimonials")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((item) => ({
          id: item.id,
          clientName: item.client_name,
          clientRole: item.client_role || "",
          company: item.company || "",
          content: item.content,
          avatarUrl: item.avatar_url || undefined,
          rating: item.rating ?? 5,
        }));
      }
      if (error) {
        console.warn("[DB] testimonials query failed, using defaults:", error.message);
      }
    } catch (e) {
      console.warn("[DB] testimonials query threw, using defaults:", e);
    }
  }
  return DEFAULT_TESTIMONIALS;
}

/**
 * Fetch site settings from Supabase, merged over the defaults.
 */
export async function getSiteSettings(): Promise<Record<string, string>> {
  const client = db();
  if (client) {
    try {
      const { data, error } = await client.from("site_settings").select("key, value");
      if (!error && data && data.length > 0) {
        const settings: Record<string, string> = {};
        for (const row of data) settings[row.key] = row.value;
        return { ...DEFAULT_SETTINGS, ...settings };
      }
      if (error) {
        console.warn("[DB] site_settings query failed, using defaults:", error.message);
      }
    } catch (e) {
      console.warn("[DB] site_settings query threw, using defaults:", e);
    }
  }
  return DEFAULT_SETTINGS;
}
