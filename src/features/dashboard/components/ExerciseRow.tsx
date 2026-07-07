import Link from "next/link";
import {
  CheckCircle2,
  Circle,
  Lock,
  Play,
} from "lucide-react";

import { cn } from "@/lib/utils";

import type { SlotDisplayStatus } from "../lib/slot-display";
import type { SlotSummary } from "../types";

export type EnrichedExercise = SlotSummary & {
  displayStatus: SlotDisplayStatus;
  isNavigable: boolean;
  href: string | null;
};

type ExerciseRowProps = {
  exercise: EnrichedExercise;
};

function ExerciseStatusIcon({ displayStatus }: { displayStatus: SlotDisplayStatus }) {
  switch (displayStatus) {
    case "completed":
      return (
        <CheckCircle2
          className="size-5 shrink-0 text-emerald-600"
          aria-hidden="true"
        />
      );
    case "current":
      return (
        <Play
          className="size-5 shrink-0 fill-onboarding-primary text-onboarding-primary"
          aria-hidden="true"
        />
      );
    case "locked":
      return (
        <Lock className="size-5 shrink-0 text-onboarding-muted" aria-hidden="true" />
      );
    default:
      return (
        <Circle className="size-5 shrink-0 text-onboarding-muted" aria-hidden="true" />
      );
  }
}

function formatDuration(durationMin: number | null): string | null {
  if (!durationMin) {
    return null;
  }

  return `${durationMin} min`;
}

/** @deprecated Use CourseSlot instead */
export function ExerciseRow({ exercise }: ExerciseRowProps) {
  const durationLabel = formatDuration(exercise.durationMin);
  const isCurrent = exercise.displayStatus === "current";
  const rowClassName = cn(
    "flex items-start gap-3 rounded-xl border px-4 py-3 transition-colors",
    isCurrent
      ? "border-onboarding-primary/30 bg-onboarding-primary/5"
      : exercise.displayStatus === "locked"
        ? "border-onboarding-border/60 bg-onboarding-surface/20 opacity-80"
        : "border-onboarding-border/70 bg-white/70 hover:border-onboarding-border hover:bg-white",
  );

  const content = (
    <>
      <ExerciseStatusIcon displayStatus={exercise.displayStatus} />
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "font-medium",
            isCurrent
              ? "text-onboarding-primary"
              : exercise.displayStatus === "locked"
                ? "text-onboarding-muted"
                : "text-onboarding-foreground",
          )}
        >
          {exercise.assignedExerciseTitle ?? exercise.title}
        </p>
        {durationLabel ? (
          <p className="mt-0.5 text-sm text-onboarding-muted">{durationLabel}</p>
        ) : null}
      </div>
    </>
  );

  if (exercise.isNavigable && exercise.href) {
    return (
      <Link href={exercise.href} className={cn(rowClassName, "group")}>
        {content}
      </Link>
    );
  }

  return (
    <div className={rowClassName} aria-disabled="true">
      {content}
    </div>
  );
}
