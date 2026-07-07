import { CheckCircle2, Lock } from "lucide-react";

import { cn } from "@/lib/utils";

import type { SectionBadgeVariant } from "../lib/exercise-display";
import type { SectionSummary } from "../types";

type SectionProgressProps = {
  section: SectionSummary;
  className?: string;
};

export function SectionProgress({ section, className }: SectionProgressProps) {
  return (
    <p className={cn("text-sm text-onboarding-muted", className)}>
      {section.isLocked
        ? "Complete the previous section to unlock"
        : `${section.completedCount} of ${section.exerciseCount} exercises completed`}
    </p>
  );
}

type SectionCompletionBadgeProps = {
  variant: SectionBadgeVariant;
};

export function SectionCompletionBadge({ variant }: SectionCompletionBadgeProps) {
  if (variant === "locked") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-onboarding-muted">
        <Lock className="size-4 shrink-0" aria-hidden="true" />
        Locked
      </span>
    );
  }

  if (variant === "complete") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-onboarding-primary">
        <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />
        Complete
      </span>
    );
  }

  if (variant === "current") {
    return (
      <span className="inline-flex items-center rounded-full bg-onboarding-primary/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-onboarding-primary">
        Current
      </span>
    );
  }

  return (
    <span className="text-xs font-medium uppercase tracking-wide text-onboarding-muted">
      Unlocked
    </span>
  );
}
