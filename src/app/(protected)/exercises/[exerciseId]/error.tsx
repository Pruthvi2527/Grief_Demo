"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { useEffect } from "react";

import { Button, buttonVariants } from "@/components/ui/button";

export default function ExerciseError({
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
    error.message.includes("exercise") ||
    error.message.includes("exercise_progress") ||
    error.message.includes("column") ||
    error.message.includes("relation");

  return (
    <main className="flex min-h-screen items-center justify-center bg-onboarding-background p-6">
      <div className="max-w-md space-y-4 text-center">
        <AlertCircle className="mx-auto size-12 text-destructive" aria-hidden="true" />
        <h1 className="text-xl font-semibold text-onboarding-foreground">
          Could not load exercise
        </h1>
        <p className="text-sm text-onboarding-muted">
          {isDatabaseError
            ? "Database tables may be missing or out of date. Apply the Supabase migrations, then try again."
            : "Something went wrong while loading this exercise."}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            onClick={reset}
            className="bg-onboarding-primary text-white hover:bg-onboarding-primary/90"
          >
            Try again
          </Button>
          <Link
            href="/dashboard"
            className={buttonVariants({ variant: "outline" })}
          >
            Back to My Tree
          </Link>
        </div>
      </div>
    </main>
  );
}
