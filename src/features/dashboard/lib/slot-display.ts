import type { SlotAssignmentType } from "@/types/database.course";

import type { SlotSummary } from "../types";

export type SlotDisplayStatus =
  | "completed"
  | "current"
  | "not_started"
  | "locked";

export type SlotSelectionTypeLabel = "Fixed" | "Rule Based" | "AI";

export type EnrichedSlot = SlotSummary & {
  displayStatus: SlotDisplayStatus;
  isNavigable: boolean;
  href: string | null;
  selectionTypeLabel: SlotSelectionTypeLabel;
};

export function mapSelectionTypeLabel(
  assignmentType: SlotAssignmentType,
): SlotSelectionTypeLabel {
  switch (assignmentType) {
    case "fixed":
      return "Fixed";
    case "rule_based":
      return "Rule Based";
    case "ai_selected":
      return "AI";
    default:
      return "Fixed";
  }
}

export function resolveSlotDisplayStatus(
  slot: SlotSummary,
  sectionLocked: boolean,
  slotIndex: number,
  previousSlots: SlotSummary[],
  currentExerciseId: string | null,
): SlotDisplayStatus {
  if (sectionLocked) {
    return "locked";
  }

  if (!slot.assignedExerciseId) {
    return "locked";
  }

  if (slot.status === "completed") {
    return "completed";
  }

  if (slotIndex > 0) {
    const previousSlot = previousSlots[slotIndex - 1];

    if (previousSlot?.status !== "completed") {
      return "locked";
    }
  }

  if (
    slot.assignedExerciseId === currentExerciseId ||
    slot.status === "in_progress"
  ) {
    return "current";
  }

  return "not_started";
}

export function isSlotNavigable(status: SlotDisplayStatus): boolean {
  return status !== "locked";
}

export function enrichSectionSlots(
  slots: SlotSummary[],
  sectionLocked: boolean,
  currentExerciseId: string | null,
): EnrichedSlot[] {
  return slots.map((slot, index) => {
    const displayStatus = resolveSlotDisplayStatus(
      slot,
      sectionLocked,
      index,
      slots,
      currentExerciseId,
    );
    const isNavigable =
      isSlotNavigable(displayStatus) && Boolean(slot.assignedExerciseId);

    return {
      ...slot,
      displayStatus,
      isNavigable,
      href:
        isNavigable && slot.assignedExerciseId
          ? `/exercises/${slot.assignedExerciseId}`
          : null,
      selectionTypeLabel: mapSelectionTypeLabel(slot.assignmentType),
    };
  });
}

export function getDefaultExpandedSectionIds(
  sections: { id: string; isCurrent: boolean }[],
): string[] {
  const currentSection = sections.find((section) => section.isCurrent);

  return currentSection ? [currentSection.id] : [];
}

export type SectionBadgeVariant = "locked" | "complete" | "current" | "unlocked";

export function getSectionBadgeVariant(section: {
  isLocked: boolean;
  isCurrent: boolean;
  slotCount: number;
  completedCount: number;
}): SectionBadgeVariant {
  if (section.isLocked) {
    return "locked";
  }

  if (section.slotCount > 0 && section.completedCount === section.slotCount) {
    return "complete";
  }

  if (section.isCurrent) {
    return "current";
  }

  return "unlocked";
}
