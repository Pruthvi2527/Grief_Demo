import { cn } from "@/lib/utils";

import type { SlotDisplayStatus } from "../lib/slot-display";

type SlotStatusBadgeProps = {
  status: SlotDisplayStatus;
  className?: string;
};

const statusConfig: Record<
  SlotDisplayStatus,
  { label: string; className: string }
> = {
  completed: {
    label: "Completed",
    className: "bg-emerald-50 text-emerald-700",
  },
  current: {
    label: "Current",
    className: "bg-onboarding-primary/10 text-onboarding-primary",
  },
  not_started: {
    label: "Not Started",
    className: "bg-onboarding-surface text-onboarding-muted",
  },
  locked: {
    label: "Locked",
    className: "bg-onboarding-surface/60 text-onboarding-muted",
  },
};

export function SlotStatusBadge({ status, className }: SlotStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  );
}

type SlotSelectionTypeBadgeProps = {
  label: string;
  className?: string;
};

export function SlotSelectionTypeBadge({
  label,
  className,
}: SlotSelectionTypeBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-onboarding-border px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-onboarding-muted",
        className,
      )}
    >
      {label}
    </span>
  );
}
