import type { SlotAssignmentType } from "@/types/database.course";

import type {
  ExerciseProgressStatus,
  SectionSummary,
  SlotSummary,
} from "../types";

type SectionRow = {
  id: string;
  title: string;
  description: string | null;
  order_index: number;
};

type SlotRow = {
  id: string;
  section_id: string;
  title: string;
  order_index: number;
  assignment_type: SlotAssignmentType;
  fixed_exercise_id: string | null;
};

type ExerciseLibraryRow = {
  id: string;
  title: string;
  duration_min: number | null;
};

type AssignmentRow = {
  slot_id: string;
  exercise_id: string;
};

type ProgressRow = {
  exercise_id: string;
  status: ExerciseProgressStatus;
};

export function buildSlotDashboardViewModel(
  sections: SectionRow[],
  slots: SlotRow[],
  exercises: ExerciseLibraryRow[],
  assignments: AssignmentRow[],
  progress: ProgressRow[],
): {
  sections: SectionSummary[];
  overallProgressPercent: number;
  totalExercises: number;
  completedExercises: number;
  currentSection: SectionSummary | null;
  continueJourney: {
    exerciseId: string;
    exerciseTitle: string;
    sectionId: string;
    sectionTitle: string;
    durationMin: number | null;
    status: ExerciseProgressStatus;
  } | null;
} {
  const progressMap = new Map(progress.map((item) => [item.exercise_id, item.status]));
  const exerciseMap = new Map(exercises.map((item) => [item.id, item]));
  const assignmentMap = new Map(
    assignments.map((item) => [item.slot_id, item.exercise_id]),
  );

  const slotsBySection = slots.reduce<Record<string, SlotRow[]>>((acc, slot) => {
    if (!acc[slot.section_id]) {
      acc[slot.section_id] = [];
    }

    acc[slot.section_id].push(slot);
    return acc;
  }, {});

  const sortedSections = [...sections].sort(
    (a, b) => a.order_index - b.order_index,
  );

  let previousSectionComplete = true;
  let currentSectionAssigned = false;
  let totalExercises = 0;
  let completedExercises = 0;

  const sectionSummaries: SectionSummary[] = sortedSections.map((section) => {
    const sectionSlots = (slotsBySection[section.id] ?? []).sort(
      (a, b) => a.order_index - b.order_index,
    );

    const slotSummaries: SlotSummary[] = sectionSlots.map((slot, index) => {
      const assignedExerciseId =
        assignmentMap.get(slot.id) ?? slot.fixed_exercise_id;
      const assignedExercise = assignedExerciseId
        ? exerciseMap.get(assignedExerciseId)
        : null;
      const status = assignedExerciseId
        ? (progressMap.get(assignedExerciseId) ?? "not_started")
        : "not_started";

      return {
        id: slot.id,
        sectionId: slot.section_id,
        slotNumber: index + 1,
        title: slot.title,
        assignmentType: slot.assignment_type,
        assignedExerciseId: assignedExerciseId ?? null,
        assignedExerciseTitle: assignedExercise?.title ?? null,
        durationMin: assignedExercise?.duration_min ?? null,
        orderIndex: slot.order_index,
        status,
      };
    });

    const slotCount = slotSummaries.length;
    const sectionCompletedCount = slotSummaries.filter(
      (slot) => slot.status === "completed",
    ).length;

    totalExercises += slotCount;
    completedExercises += sectionCompletedCount;

    const isLocked = !previousSectionComplete;
    const hasIncomplete = sectionCompletedCount < slotCount;
    const isCurrent =
      !isLocked && !currentSectionAssigned && (hasIncomplete || slotCount === 0);

    if (isCurrent) {
      currentSectionAssigned = true;
    }

    previousSectionComplete =
      slotCount > 0 && sectionCompletedCount === slotCount;

    return {
      id: section.id,
      title: section.title,
      description: section.description,
      orderIndex: section.order_index,
      slotCount,
      exerciseCount: slotCount,
      completedCount: sectionCompletedCount,
      isLocked,
      isCurrent,
      slots: slotSummaries,
    };
  });

  const currentSection =
    sectionSummaries.find((section) => section.isCurrent) ??
    sectionSummaries.find((section) => !section.isLocked) ??
    null;

  const orderedSlots = sectionSummaries.flatMap((section) =>
    section.slots.map((slot) => ({
      ...slot,
      sectionTitle: section.title,
    })),
  );

  const inProgressSlot = orderedSlots.find(
    (slot) => slot.status === "in_progress" && slot.assignedExerciseId,
  );

  const nextIncompleteSlot =
    inProgressSlot ??
    (currentSection
      ? currentSection.slots.find(
          (slot) => slot.status !== "completed" && slot.assignedExerciseId,
        )
      : orderedSlots.find(
          (slot) => slot.status !== "completed" && slot.assignedExerciseId,
        ));

  const continueJourney =
    nextIncompleteSlot?.assignedExerciseId &&
    nextIncompleteSlot.assignedExerciseTitle
      ? {
          exerciseId: nextIncompleteSlot.assignedExerciseId,
          exerciseTitle: nextIncompleteSlot.assignedExerciseTitle,
          sectionId: nextIncompleteSlot.sectionId,
          sectionTitle:
            sectionSummaries.find(
              (section) => section.id === nextIncompleteSlot.sectionId,
            )?.title ?? "",
          durationMin: nextIncompleteSlot.durationMin,
          status: nextIncompleteSlot.status,
        }
      : null;

  const overallProgressPercent =
    totalExercises === 0
      ? 0
      : Math.round((completedExercises / totalExercises) * 100);

  return {
    sections: sectionSummaries,
    overallProgressPercent,
    totalExercises,
    completedExercises,
    currentSection,
    continueJourney,
  };
}
