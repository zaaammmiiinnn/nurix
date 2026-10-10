/**
 * Single source of truth for environment-derived configuration.
 *
 * Previously the public site's canonical origin was hardcoded as
 * "https://neuralwaves.in" in twelve files while NEXT_PUBLIC_SITE_URL (the value
 * actually set in the deployment) was read nowhere. The domain in question is not
 * even registered, so every canonical, sitemap entry and JSON-LD @id pointed at a
 * dead host.
 *
 * Change NEXT_PUBLIC_SITE_URL in one place and canonical URLs, the sitemap,
 * robots.txt, OpenGraph metadata and structured data all follow.
 */

/** Public origin, no trailing slash. Set NEXT_PUBLIC_SITE_URL in the environment. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://neuralwaves.in"
).replace(/\/+$/, "");

/** Build an absolute URL for a site-relative path. */
export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Hostname without protocol, for display inside OpenGraph images. */
export const SITE_HOST = SITE_URL.replace(/^https?:\/\//, "").replace(/\/.*$/, "");

/** Public brand information used in metadata and structured data. */
export const BRAND = {
  name: "NeuralWaves",
  tagline: "AI that ships.",
  /**
   * Positioning: engineering delivered from India for UAE-market clients.
   * Stated plainly so it is never something a buyer discovers later.
   */
  deliveryNote: "Engineered in India · Serving clients across the UAE and GCC",
  location: "Dubai, United Arab Emirates",
  email: "support@neuralwaves.in",
} as const;

/** Optional Cal.com booking link, if configured. */
export const CAL_COM_URL = process.env.NEXT_PUBLIC_CAL_COM_URL?.trim() || "";

/**
 * Whether a real, publicly-reachable production origin is configured.
 * Used to avoid emitting canonical tags that point at a host we do not own.
 */
export const HAS_LIVE_ORIGIN = Boolean(process.env.NEXT_PUBLIC_SITE_URL?.trim());
