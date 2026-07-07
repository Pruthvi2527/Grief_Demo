"use client";

import { AlertCircle } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function OnboardingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const isDatabaseError =
    error.message.includes("Failed to fetch profile") ||
    error.message.includes("Failed to load onboarding") ||
    error.message.includes("column") ||
    error.message.includes("relation");

  return (
    <main className="flex min-h-screen items-center justify-center bg-onboarding-background p-6">
      <div className="max-w-md space-y-4 text-center">
        <AlertCircle className="mx-auto size-12 text-destructive" />
        <h1 className="text-xl font-semibold text-onboarding-foreground">
          Could not load onboarding
        </h1>
        <p className="text-sm text-onboarding-muted">
          {isDatabaseError
            ? "Database tables may be missing. Apply the Supabase migrations in supabase/migrations/, then try again."
            : "Something went wrong while loading your onboarding session."}
        </p>
        <Button onClick={reset} className="bg-onboarding-primary text-white">
          Try again
        </Button>
      </div>
    </main>
  );
}
