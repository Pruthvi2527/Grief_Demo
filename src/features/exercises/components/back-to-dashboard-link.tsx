"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useTransition, type MouseEvent } from "react";

import { cn } from "@/lib/utils";

import { preserveExerciseProgress } from "../actions/exercise.actions";

type BackToDashboardLinkProps = {
  exerciseId: string;
};

export function BackToDashboardLink({ exerciseId }: BackToDashboardLinkProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();

    startTransition(async () => {
      await preserveExerciseProgress(exerciseId);
      router.push("/dashboard");
    });
  }

  return (
    <Link
      href="/dashboard"
      onClick={handleClick}
      aria-busy={isPending}
      className={cn(
        "inline-flex h-10 items-center gap-2 rounded-md text-sm font-medium text-onboarding-muted transition-colors",
        "hover:text-onboarding-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-onboarding-primary focus-visible:ring-offset-2 focus-visible:ring-offset-onboarding-background",
        isPending && "pointer-events-none opacity-70",
      )}
    >
      <ArrowLeft className="size-4 shrink-0" aria-hidden="true" />
      TODashboard
    </Link>
  );
}
