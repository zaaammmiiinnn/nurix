"use client";

import { useEffect, useState } from "react";

export interface PublicSiteConfig {
  whatsappNumber: string;
  email: string;
  phone: string;
  calendarUrl: string;
  address: string;
  linkedin: string;
}

/**
 * Module-level shared request.
 *
 * Several components (nav, footer, hero, final CTA, chat widget) need the same
 * config on every page; without this each would issue its own request.
 */
let sharedRequest: Promise<Partial<PublicSiteConfig> | null> | null = null;

function fetchSiteConfig(): Promise<Partial<PublicSiteConfig> | null> {
  if (!sharedRequest) {
    sharedRequest = fetch("/api/site-config")
      .then((res) => (res.ok ? res.json() : null))
      .catch(() => null);
  }
  return sharedRequest;
}

/**
 * Reads the public site configuration the admin panel controls.
 *
 * Client components previously hardcoded the WhatsApp number, email and phone, so
 * `updateAdminSettings` changed nothing on the live pages. This keeps them in
 * sync with /api/site-config, falling back to the values passed in (the static
 * defaults) until the request resolves.
 */
export function useSiteConfig(fallback: PublicSiteConfig): PublicSiteConfig {
  const [config, setConfig] = useState<PublicSiteConfig>(fallback);

  useEffect(() => {
    let cancelled = false;

    fetchSiteConfig()
      .then((data) => {
        if (cancelled || !data) return;
        setConfig((prev) => ({
          whatsappNumber: data.whatsappNumber || prev.whatsappNumber,
          email: data.email || prev.email,
          phone: data.phone || prev.phone,
          calendarUrl: data.calendarUrl || prev.calendarUrl,
          address: data.address || prev.address,
          linkedin: data.linkedin || prev.linkedin,
        }));
      })
      .catch(() => {
        /* keep the fallback */
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return config;
}

/** Digits only — the format wa.me and tel: links require. */
export function toDialable(value: string): string {
  return (value || "").replace(/[^0-9]/g, "");
}
