import Link from "next/link";
import {
  CheckCircle2,
  Circle,
  Lock,
  Play,
  Sparkles,
} from "lucide-react";

import { cn } from "@/lib/utils";

import type { EnrichedExercise } from "../lib/exercise-display";

type ExerciseRowProps = {
  exercise: EnrichedExercise;
};

function ExerciseStatusIcon({
  displayStatus,
}: {
  displayStatus: EnrichedExercise["displayStatus"];
}) {
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

function ExerciseRowContent({ exercise }: ExerciseRowProps) {
  const durationLabel = formatDuration(exercise.durationMin);
  const isCurrent = exercise.displayStatus === "current";

  return (
    <>
      <ExerciseStatusIcon displayStatus={exercise.displayStatus} />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
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
            {exercise.title}
          </p>
          {exercise.isRecommended ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-onboarding-primary/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-onboarding-primary">
              <Sparkles className="size-3" aria-hidden="true" />
              Recommended
            </span>
          ) : null}
        </div>
        {durationLabel ? (
          <p className="mt-0.5 text-sm text-onboarding-muted">{durationLabel}</p>
        ) : null}
      </div>

      <span className="sr-only">
        {exercise.displayStatus === "completed" && "Completed"}
        {exercise.displayStatus === "current" && "Current exercise"}
        {exercise.displayStatus === "not_started" && "Not started"}
        {exercise.displayStatus === "locked" && "Locked"}
      </span>
    </>
  );
}

export function ExerciseRow({ exercise }: ExerciseRowProps) {
  const isCurrent = exercise.displayStatus === "current";
  const rowClassName = cn(
    "flex items-start gap-3 rounded-xl border px-4 py-3 transition-colors",
    isCurrent
      ? "border-onboarding-primary/30 bg-onboarding-primary/5"
      : exercise.displayStatus === "locked"
        ? "border-onboarding-border/60 bg-onboarding-surface/20 opacity-80"
        : "border-onboarding-border/70 bg-white/70 hover:border-onboarding-border hover:bg-white",
  );

  if (exercise.isNavigable && exercise.href) {
    return (
      <Link href={exercise.href} className={cn(rowClassName, "group")}>
        <ExerciseRowContent exercise={exercise} />
      </Link>
    );
  }

  return (
    <div className={rowClassName} aria-disabled="true">
      <ExerciseRowContent exercise={exercise} />
    </div>
  );
}
