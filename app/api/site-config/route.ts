import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/data/db-queries";

/**
 * Public site configuration for client components.
 *
 * The contact page, footer, nav and CTAs all hardcoded the WhatsApp number,
 * email and phone in seven separate files, so editing them in the admin panel had
 * no effect on the site. This endpoint exposes ONLY the public contact fields
 * (they are already rendered into every page) so client components can stay in
 * sync with the admin settings.
 *
 * Never add secrets here — no keys, tokens or allowlists.
 */
export const revalidate = 300;

export async function GET() {
  const settings = await getSiteSettings();

  return NextResponse.json(
    {
      whatsappNumber: settings.whatsapp_number ?? "",
      email: settings.contact_email ?? "",
      phone: settings.contact_phone ?? "",
      calendarUrl: settings.calendar_url ?? "",
      address: settings.studio_address ?? "",
      linkedin: settings.social_linkedin ?? "",
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    },
  );
}
