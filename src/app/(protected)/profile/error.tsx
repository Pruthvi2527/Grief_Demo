"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { useEffect } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { DashboardShell } from "@/features/dashboard/components";

export default function ProfileError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <DashboardShell activeNav="profile">
      <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
        <AlertCircle className="size-12 text-destructive" aria-hidden="true" />
        <h1 className="mt-6 text-xl font-semibold text-onboarding-foreground">
          Could not load profile
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-onboarding-muted">
          Something went wrong while loading your profile information.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button
            onClick={reset}
            className="bg-onboarding-primary text-white hover:bg-onboarding-primary/90"
          >
            Try again
          </Button>
          <Link href="/dashboard" className={buttonVariants({ variant: "outline" })}>
            Back to My Tree
          </Link>
        </div>
      </div>
    </DashboardShell>
  );
}
