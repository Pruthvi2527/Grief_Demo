import type { ExerciseSummary, SectionSummary } from "../types";

export type ExerciseDisplayStatus =
  | "completed"
  | "current"
  | "not_started"
  | "locked";

export type EnrichedExercise = ExerciseSummary & {
  displayStatus: ExerciseDisplayStatus;
  isNavigable: boolean;
  href: string | null;
  isRecommended: boolean;
};

export function resolveExerciseDisplayStatus(
  exercise: ExerciseSummary,
  section: SectionSummary,
  exerciseIndex: number,
  currentExerciseId: string | null,
): ExerciseDisplayStatus {
  if (section.isLocked) {
    return "locked";
  }

  if (exercise.status === "completed") {
    return "completed";
  }

  if (exerciseIndex > 0) {
    const previousExercise = section.exercises[exerciseIndex - 1];

    if (previousExercise?.status !== "completed") {
      return "locked";
    }
  }

  if (exercise.id === currentExerciseId || exercise.status === "in_progress") {
    return "current";
  }

  return "not_started";
}

export function isExerciseNavigable(status: ExerciseDisplayStatus): boolean {
  return status !== "locked";
}

export function enrichSectionExercises(
  section: SectionSummary,
  currentExerciseId: string | null,
  recommendedExerciseId?: string | null,
): EnrichedExercise[] {
  return section.exercises.map((exercise, index) => {
    const displayStatus = resolveExerciseDisplayStatus(
      exercise,
      section,
      index,
      currentExerciseId,
    );
    const isNavigable = isExerciseNavigable(displayStatus);

    return {
      ...exercise,
      displayStatus,
      isNavigable,
      href: isNavigable ? `/exercises/${exercise.id}` : null,
      isRecommended: Boolean(
        recommendedExerciseId &&
          recommendedExerciseId === exercise.id &&
          displayStatus !== "locked",
      ),
    };
  });
}

export function getDefaultExpandedSectionIds(
  sections: SectionSummary[],
): string[] {
  const currentSection = sections.find((section) => section.isCurrent);

  return currentSection ? [currentSection.id] : [];
}

export type SectionBadgeVariant = "locked" | "complete" | "current" | "unlocked";

export function getSectionBadgeVariant(section: SectionSummary): SectionBadgeVariant {
  if (section.isLocked) {
    return "locked";
  }

  if (
    section.exerciseCount > 0 &&
    section.completedCount === section.exerciseCount
  ) {
    return "complete";
  }

  if (section.isCurrent) {
    return "current";
  }

  return "unlocked";
}
