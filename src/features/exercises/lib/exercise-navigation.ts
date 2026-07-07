import type { SectionSummary } from "@/features/dashboard/types";

export type FlatExercise = {
  id: string;
  title: string;
  sectionId: string;
  sectionLocked: boolean;
};

export function buildFlatExerciseList(sections: SectionSummary[]): FlatExercise[] {
  return sections.flatMap((section) =>
    section.slots
      .filter((slot) => slot.assignedExerciseId)
      .map((slot) => ({
        id: slot.assignedExerciseId!,
        title: slot.assignedExerciseTitle ?? slot.title,
        sectionId: section.id,
        sectionLocked: section.isLocked,
      })),
  );
}

export function buildExerciseNavigation(
  sections: SectionSummary[],
  exerciseId: string,
): {
  previousExerciseId: string | null;
  previousExerciseTitle: string | null;
  nextExerciseId: string | null;
  nextExerciseTitle: string | null;
  positionInCourse: number;
  totalExercises: number;
  isAccessible: boolean;
} {
  const flatList = buildFlatExerciseList(sections);
  const currentIndex = flatList.findIndex((item) => item.id === exerciseId);
  const totalExercises = flatList.length;

  if (currentIndex === -1) {
    return {
      previousExerciseId: null,
      previousExerciseTitle: null,
      nextExerciseId: null,
      nextExerciseTitle: null,
      positionInCourse: 0,
      totalExercises,
      isAccessible: false,
    };
  }

  const current = flatList[currentIndex];
  const previous = currentIndex > 0 ? flatList[currentIndex - 1] : null;
  const next =
    currentIndex < flatList.length - 1 ? flatList[currentIndex + 1] : null;

  return {
    previousExerciseId: previous?.id ?? null,
    previousExerciseTitle: previous?.title ?? null,
    nextExerciseId: next && !next.sectionLocked ? next.id : null,
    nextExerciseTitle: next && !next.sectionLocked ? next.title : null,
    positionInCourse: currentIndex + 1,
    totalExercises,
    isAccessible: !current.sectionLocked,
  };
}
