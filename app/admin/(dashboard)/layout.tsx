import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { verifyAdminAccess } from "@/lib/auth/admin-auth";
import { AdminShell } from "@/components/admin/admin-shell";
import { UnauthorizedView } from "@/components/admin/unauthorized-view";

export const metadata: Metadata = {
  title: "NeuralWaves Ops — Admin Portal",
  robots: { index: false, follow: false },
};

/**
 * Never prerender or cache the admin area.
 *
 * Without this, Next attempted to statically render these routes at build time;
 * the auth check needs request headers, so every build emitted a
 * "Dynamic server usage" error and an UnauthorizedError from requireAdmin().
 * More importantly, administrative data must always be read per-request —
 * a cached admin page could serve one operator's data to another.
 */
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authResult = await verifyAdminAccess();

  // If unauthenticated, redirect to admin login
  if (authResult.status === "unauthenticated") {
    redirect("/admin/login");
  }

  // If user is logged in but unverified or unauthorized (not in admin whitelist)
  if (authResult.status === "unverified" || authResult.status === "unauthorized") {
    return (
      <UnauthorizedView
        status={authResult.status}
        email={authResult.email}
        authProvider={authResult.authProvider}
        message={authResult.message}
      />
    );
  }

  // User is authenticated, verified, and authorized!
  return (
    <AdminShell
      adminEmail={authResult.email}
      isClerkAuth={authResult.authProvider === "clerk"}
    >
      {children}
    </AdminShell>
  );
}
