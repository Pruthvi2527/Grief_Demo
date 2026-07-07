import type { Metadata } from "next";

import { SignupCard } from "@/features/auth/components";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your bonds account",
};

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-onboarding-background p-6">
      <SignupCard />
    </main>
  );
}
