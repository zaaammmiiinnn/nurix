import { SignIn } from "@clerk/nextjs";

// Authentication surfaces must not appear in search results.
export const metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn />
    </div>
  );
}
