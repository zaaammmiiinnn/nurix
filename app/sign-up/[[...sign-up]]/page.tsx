import { SignUp } from "@clerk/nextjs";

/**
 * Public self-signup.
 *
 * NOTE: the admin panel is gated by the ADMIN_EMAILS allowlist, so registering
 * here grants no access. For a single-tenant studio site you almost certainly
 * want registration disabled entirely in the Clerk dashboard
 * (User & Authentication -> Restrictions), which leaves this route unused.
 */
export const metadata = {
  title: "Sign up",
  robots: { index: false, follow: false },
};

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp />
    </div>
  );
}
