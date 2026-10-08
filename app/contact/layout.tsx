import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Contact — Book a 15-Minute Scoping Call",
  description:
    "Direct contact for Dubai AI automation sprints. Chat directly on WhatsApp or book a 15-minute scoping call. Fast quotes, fixed price, delivered in days.",
  alternates: {
    canonical: "https://nurix.ae/contact",
    languages: {
      "en-AE": "https://nurix.ae/contact",
      "ar-AE": "https://nurix.ae/ar/contact",
    },
  },
  openGraph: {
    title: "Contact Nurix — Book a 15-Minute Scoping Call",
    description: "Direct contact for Dubai AI automation sprints. WhatsApp or calendar booking.",
    url: "https://nurix.ae/contact",
    images: [
      {
        url: "/api/og?title=Contact%20Nurix&subtitle=Book%20a%2015-minute%20call%20or%20WhatsApp%20us.&badge=START%20A%20SPRINT",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Nurix — AI that ships.",
    description: "Book a 15-minute scoping call or WhatsApp our Dubai team.",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Contact", url: "/contact" },
        ]}
      />
      {children}
    </>
  );
}
