import { MetadataRoute } from "next";
import { SERVICES_DATA, PROJECTS_DATA } from "@/lib/data/site-data";
import { getProjects, getServices } from "@/lib/data/db-queries";
import { SITE_URL } from "@/lib/config";

/**
 * Regenerate the sitemap periodically rather than baking it at build time, and
 * read content from the database.
 *
 * The sitemap previously read the static SERVICES_DATA / PROJECTS_DATA, so a
 * service or case study added in the admin panel never appeared in it, and one
 * deleted in the panel stayed listed as a 404.
 */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;

  // Prefer live content; fall back to the bundled data if the database is
  // unavailable so the sitemap is never empty.
  let services = SERVICES_DATA as { slug: string }[];
  let projects = PROJECTS_DATA as { slug: string }[];

  try {
    const [dbServices, dbProjects] = await Promise.all([getServices(), getProjects()]);
    if (dbServices.length > 0) services = dbServices;
    if (dbProjects.length > 0) projects = dbProjects;
  } catch (e) {
    console.warn("[sitemap] falling back to static content:", e);
  }

  // Use the newest content date rather than the build timestamp, which told
  // search engines nothing useful.
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified, changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/services`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/pricing`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/work`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified, changeFrequency: "monthly", priority: 0.8 },
  ];

  // De-duplicate: the three bespoke service routes are also matched by
  // /services/[slug], so a naive concatenation could list a URL twice.
  const seen = new Set(staticRoutes.map((r) => r.url));

  const serviceRoutes: MetadataRoute.Sitemap = [];
  for (const service of services) {
    const url = `${baseUrl}/services/${service.slug}`;
    if (seen.has(url)) continue;
    seen.add(url);
    serviceRoutes.push({
      url,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.85,
    });
  }

  const projectRoutes: MetadataRoute.Sitemap = [];
  for (const project of projects) {
    const url = `${baseUrl}/work/${project.slug}`;
    if (seen.has(url)) continue;
    seen.add(url);
    projectRoutes.push({
      url,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.75,
    });
  }

  return [...staticRoutes, ...serviceRoutes, ...projectRoutes];
}
