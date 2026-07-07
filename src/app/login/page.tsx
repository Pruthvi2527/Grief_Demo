import type { Metadata } from "next";

import { LoginCard } from "@/features/auth/components";
import {
  getAuthErrorMessage,
  getAuthSuccessMessage,
} from "@/features/auth/lib/errors";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your bonds account",
};

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
    next?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-onboarding-background p-6">
      <LoginCard
        error={getAuthErrorMessage(params.error)}
        message={getAuthSuccessMessage(params.message)}
      />
    </main>
  );
}
