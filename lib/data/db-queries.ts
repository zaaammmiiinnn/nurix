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
import { getAdminServices } from "@/app/admin/services/actions";
import { getAdminProjects } from "@/app/admin/portfolio/actions";
import { getAdminPricingTiers } from "@/app/admin/pricing/actions";
import { getAdminFaqs } from "@/app/admin/faqs/actions";
import { getAdminTestimonials } from "@/app/admin/testimonials/actions";
import { getAdminSettings } from "@/app/admin/settings/actions";

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
    content: "NeuralWaves deployed our Palm Jumeirah WhatsApp bot in 4 days. Lead response time dropped from 45 minutes to under 30 seconds. We closed 3 villa transactions within the first 3 weeks.",
    rating: 5,
  },
  {
    clientName: "Omar Al Qasimi",
    clientRole: "Operations Head",
    company: "Karak & Co. Cloud Kitchens",
    content: "The dispatch dashboard replaced 4 WhatsApp groups and 2 spreadsheets. Orders route directly to kitchen displays in under 2 seconds. Saved our team 3+ hours every single shift.",
    rating: 5,
  },
  {
    clientName: "Sarah Jenkins",
    clientRole: "Head of Procurement",
    company: "Apex Maritime Logistics (JAFZA)",
    content: "Autonomous lead and tender scraping agent running 24/7. Brings qualified port clearances directly into our pipeline before our competitors even notice them.",
    rating: 5,
  },
];

const DEFAULT_SETTINGS: Record<string, string> = {
  whatsapp_number: SITE_CONFIG.contact.whatsapp,
  contact_email: SITE_CONFIG.contact.email,
  contact_phone: SITE_CONFIG.contact.phone,
  calendar_url: SITE_CONFIG.contact.calUrl,
  studio_address: `${SITE_CONFIG.address.streetAddress}, ${SITE_CONFIG.address.addressLocality}, ${SITE_CONFIG.location}`,
};

/**
 * Fetch all active services from Supabase / Admin Action.
 */
export async function getServices(): Promise<ServiceItem[]> {
  try {
    const adminServices = await getAdminServices();
    if (adminServices && adminServices.length > 0) {
      return adminServices
        .filter((s) => s.is_active)
        .map((item, idx) => ({
          number: item.number || String(idx + 1).padStart(2, "0"),
          slug: item.slug,
          title: item.title,
          tagline: item.tagline || "",
          description: item.description || "",
          longDescription: item.description || "",
          deliverables: Array.isArray(item.features) ? item.features : [],
          pricing: item.pricing || "From AED 1,500",
          pricingNumeric: 1500,
          delivery: item.delivery_days || "3–5 days",
          waText: `Hi NeuralWaves, I want to discuss ${item.title}`,
          benefits: [],
          idealFor: [],
        }));
    }
  } catch (e) {
    console.warn("[DB] Failed fetching services from admin action, using static fallback:", e);
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
 * Fetch all published projects from Supabase / Admin Action.
 */
export async function getProjects(): Promise<ProjectItem[]> {
  try {
    const adminProjects = await getAdminProjects();
    if (adminProjects && adminProjects.length > 0) {
      return adminProjects.map((item) => ({
        slug: item.slug,
        title: item.title,
        client: item.client || "",
        sector: item.sector || "",
        tag: item.tag || "",
        resultMetric: item.result_metric || "",
        overview: item.overview || "",
        problem: item.problem || "",
        solution: item.solution || "",
        techStack: Array.isArray(item.tech_stack) ? item.tech_stack : [],
        isDemo: Boolean(item.is_demo),
        isFeatured: Boolean(item.is_featured),
        deliveryDays: item.delivery_days || "5 days",
      }));
    }
  } catch (e) {
    console.warn("[DB] Failed fetching projects from admin action, using static fallback:", e);
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
 * Fetch a single project by slug from Supabase / Admin Action.
 */
export async function getProjectBySlug(slug: string): Promise<ProjectItem | null> {
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug) || null;
}

/**
 * Fetch pricing tiers from Supabase / Admin Action.
 */
export async function getPricingTiers(): Promise<PricingTier[]> {
  try {
    const adminTiers = await getAdminPricingTiers();
    if (adminTiers && adminTiers.length > 0) {
      return adminTiers.map((item) => ({
        name: item.name,
        price: item.price,
        priceNumeric: item.price_numeric ? Number(item.price_numeric) : 1500,
        description: item.description || "",
        deliveryTimeframe: item.delivery_timeframe || "",
        features: Array.isArray(item.features) ? item.features : [],
        ctaLabel: item.cta_label || "Get started",
        isFeatured: Boolean(item.is_featured),
      }));
    }
  } catch (e) {
    console.warn("[DB] Failed fetching pricing tiers from admin action:", e);
  }

  return PRICING_TIERS_DATA;
}

/**
 * Fetch FAQs from Supabase / Admin Action.
 */
export async function getFaqs(category?: "general" | "pricing" | "technical"): Promise<FaqItem[]> {
  try {
    const adminFaqs = await getAdminFaqs();
    if (adminFaqs && adminFaqs.length > 0) {
      const activeFaqs = adminFaqs
        .filter((f) => f.is_active)
        .filter((f) => !category || f.category.toLowerCase() === category.toLowerCase())
        .map((item) => ({
          question: item.question,
          answer: item.answer,
          category: item.category as "general" | "pricing" | "technical",
        }));
      if (activeFaqs.length > 0) return activeFaqs;
    }
  } catch (e) {
    console.warn("[DB] Failed fetching FAQs from admin action:", e);
  }

  if (category) {
    return FAQS_DATA.filter((f) => f.category === category);
  }
  return FAQS_DATA;
}

/**
 * Fetch Testimonials from Supabase / Admin Action.
 */
export async function getTestimonials(): Promise<TestimonialItem[]> {
  try {
    const adminTestimonials = await getAdminTestimonials();
    if (adminTestimonials && adminTestimonials.length > 0) {
      return adminTestimonials
        .filter((t) => t.is_active)
        .map((item) => ({
          id: item.id,
          clientName: item.client_name,
          clientRole: item.client_role,
          company: item.company,
          content: item.content,
          avatarUrl: item.avatar_url,
          rating: item.rating,
        }));
    }
  } catch (e) {
    console.warn("[DB] Failed fetching testimonials from admin action:", e);
  }

  return DEFAULT_TESTIMONIALS;
}

/**
 * Fetch site settings from Supabase / Admin Action.
 */
export async function getSiteSettings(): Promise<Record<string, string>> {
  try {
    const settings = await getAdminSettings();
    if (settings && Object.keys(settings).length > 0) {
      return { ...DEFAULT_SETTINGS, ...settings };
    }
  } catch (e) {
    console.warn("[DB] Failed fetching site settings from admin action:", e);
  }

  return DEFAULT_SETTINGS;
}
