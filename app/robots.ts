import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/*", "/api/admin/*", "/api/og/*"],
      },
    ],
    sitemap: "https://nurix.ae/sitemap.xml",
    host: "https://nurix.ae",
  };
}
