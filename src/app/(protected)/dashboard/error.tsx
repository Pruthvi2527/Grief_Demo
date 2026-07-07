"use client";

import { AlertCircle } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { DashboardShell } from "@/features/dashboard/components";

export default function DashboardError({
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
    error.message.includes("sections") ||
    error.message.includes("exercises") ||
    error.message.includes("exercise_progress") ||
    error.message.includes("column") ||
    error.message.includes("relation");

  return (
    <DashboardShell activeNav="tree">
      <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
        <AlertCircle className="size-12 text-destructive" aria-hidden="true" />
        <h1 className="mt-6 text-xl font-semibold text-onboarding-foreground">
          Could not load your dashboard
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-onboarding-muted">
          {isDatabaseError
            ? "Database tables may be missing or out of date. Apply the Supabase migrations, then try again."
            : "Something went wrong while loading your course progress."}
        </p>
        <Button
          onClick={reset}
          className="mt-6 bg-onboarding-primary text-white hover:bg-onboarding-primary/90"
        >
          Try again
        </Button>
      </div>
    </DashboardShell>
  );
}
