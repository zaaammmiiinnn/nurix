import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/admin-shell";

export const metadata: Metadata = {
  title: "Nurix Ops — Admin Portal",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const hasDemoCookie = cookieStore.get("nurix_admin_demo_session")?.value === "1";
  const demoEmail = cookieStore.get("nurix_admin_email")?.value || "admin@nurix.ae";

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isConfigured = Boolean(
    supabaseUrl && !supabaseUrl.includes("YOUR_PROJECT") && !supabaseUrl.includes("placeholder")
  );

  let adminEmail = demoEmail;

  if (isConfigured) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user && !hasDemoCookie) {
      redirect("/admin/login");
    }

    if (user) {
      adminEmail = user.email || "admin@nurix.ae";

      // Verify user ID in admins table
      const { data: adminRow } = await supabase
        .from("admins")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!adminRow && !hasDemoCookie) {
        redirect(
          `/admin/login?error=not_authorized&email=${encodeURIComponent(adminEmail)}`
        );
      }
    }
  } else {
    // In unconfigured dev mode, check demo cookie
    if (!hasDemoCookie) {
      redirect("/admin/login");
    }
  }

  return <AdminShell adminEmail={adminEmail}>{children}</AdminShell>;
}
