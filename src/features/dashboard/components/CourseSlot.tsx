import Link from "next/link";
import { Lock } from "lucide-react";

import { cn } from "@/lib/utils";

import type { EnrichedSlot } from "../lib/slot-display";
import { SlotSelectionTypeBadge, SlotStatusBadge } from "./SlotStatusBadge";

type CourseSlotProps = {
  slot: EnrichedSlot;
};

function formatDuration(durationMin: number | null): string | null {
  if (!durationMin) {
    return null;
  }

  return `${durationMin} min`;
}

function CourseSlotContent({ slot }: CourseSlotProps) {
  const durationLabel = formatDuration(slot.durationMin);
  const isCurrent = slot.displayStatus === "current";
  const exerciseLabel =
    slot.assignedExerciseTitle ??
    (slot.displayStatus === "locked" ? "Locked" : "Awaiting assignment");

  return (
    <>
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-onboarding-surface text-sm font-semibold text-onboarding-primary">
        {slot.slotNumber}
      </div>

      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-medium uppercase tracking-wide text-onboarding-muted">
            Slot {slot.slotNumber}
          </p>
          <SlotSelectionTypeBadge label={slot.selectionTypeLabel} />
          <SlotStatusBadge status={slot.displayStatus} />
        </div>

        <div>
          <p
            className={cn(
              "text-sm font-medium text-onboarding-muted",
              isCurrent && "text-onboarding-primary",
            )}
          >
            Assigned exercise
          </p>
          <p
            className={cn(
              "font-medium",
              isCurrent
                ? "text-onboarding-primary"
                : slot.displayStatus === "locked"
                  ? "text-onboarding-muted"
                  : "text-onboarding-foreground",
            )}
          >
            {exerciseLabel}
          </p>
          {durationLabel ? (
            <p className="mt-0.5 text-sm text-onboarding-muted">{durationLabel}</p>
          ) : null}
        </div>
      </div>

      {slot.displayStatus === "locked" ? (
        <Lock className="size-4 shrink-0 text-onboarding-muted" aria-hidden="true" />
      ) : null}
    </>
  );
}

export function CourseSlot({ slot }: CourseSlotProps) {
  const isCurrent = slot.displayStatus === "current";
  const rowClassName = cn(
    "flex items-start gap-3 rounded-xl border px-4 py-3 transition-colors",
    isCurrent
      ? "border-onboarding-primary/30 bg-onboarding-primary/5"
      : slot.displayStatus === "locked"
        ? "border-onboarding-border/60 bg-onboarding-surface/20 opacity-80"
        : "border-onboarding-border/70 bg-white/70 hover:border-onboarding-border hover:bg-white",
  );

  if (slot.isNavigable && slot.href) {
    return (
      <Link href={slot.href} className={cn(rowClassName, "group")}>
        <CourseSlotContent slot={slot} />
      </Link>
    );
  }

  return (
    <div className={rowClassName} aria-disabled="true">
      <CourseSlotContent slot={slot} />
    </div>
  );
}
