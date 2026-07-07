import type {
  ExerciseProgressStatus,
  ExerciseSummary,
  SectionSummary,
} from "../types";

type SectionRow = {
  id: string;
  title: string;
  description: string | null;
  order_index: number;
};

type ExerciseRow = {
  id: string;
  section_id: string;
  title: string;
  description: string | null;
  order_index: number;
  duration_min: number | null;
};

type ProgressRow = {
  exercise_id: string;
  status: ExerciseProgressStatus;
};

export function buildDashboardViewModel(
  sections: SectionRow[],
  exercises: ExerciseRow[],
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

  const exercisesBySection = exercises.reduce<Record<string, ExerciseRow[]>>(
    (acc, exercise) => {
      if (!acc[exercise.section_id]) {
        acc[exercise.section_id] = [];
      }

      acc[exercise.section_id].push(exercise);
      return acc;
    },
    {},
  );

  const sortedSections = [...sections].sort(
    (a, b) => a.order_index - b.order_index,
  );

  let previousSectionComplete = true;
  let currentSectionAssigned = false;
  let totalExercises = 0;
  let completedExercises = 0;

  const sectionSummaries: SectionSummary[] = sortedSections.map((section) => {
    const sectionExercises = (exercisesBySection[section.id] ?? []).sort(
      (a, b) => a.order_index - b.order_index,
    );

    const exerciseSummaries: ExerciseSummary[] = sectionExercises.map(
      (exercise) => {
        const status = progressMap.get(exercise.id) ?? "not_started";
        return {
          id: exercise.id,
          sectionId: exercise.section_id,
          title: exercise.title,
          description: exercise.description,
          durationMin: exercise.duration_min,
          orderIndex: exercise.order_index,
          status,
        };
      },
    );

    const exerciseCount = exerciseSummaries.length;
    const sectionCompletedCount = exerciseSummaries.filter(
      (exercise) => exercise.status === "completed",
    ).length;

    totalExercises += exerciseCount;
    completedExercises += sectionCompletedCount;

    const isLocked = !previousSectionComplete;
    const hasIncomplete = sectionCompletedCount < exerciseCount;
    const isCurrent =
      !isLocked && !currentSectionAssigned && (hasIncomplete || exerciseCount === 0);

    if (isCurrent) {
      currentSectionAssigned = true;
    }

    previousSectionComplete =
      exerciseCount > 0 && sectionCompletedCount === exerciseCount;

    return {
      id: section.id,
      title: section.title,
      description: section.description,
      orderIndex: section.order_index,
      exerciseCount,
      completedCount: sectionCompletedCount,
      isLocked,
      isCurrent,
      exercises: exerciseSummaries,
    };
  });

  const currentSection =
    sectionSummaries.find((section) => section.isCurrent) ??
    sectionSummaries.find((section) => !section.isLocked) ??
    null;

  const orderedExercises = sectionSummaries.flatMap((section) =>
    section.exercises.map((exercise) => ({
      ...exercise,
      sectionTitle: section.title,
    })),
  );

  const inProgressExercise = orderedExercises.find(
    (exercise) => exercise.status === "in_progress",
  );

  const nextIncompleteExercise =
    inProgressExercise ??
    (currentSection
      ? currentSection.exercises
          .map((exercise) => ({
            ...exercise,
            sectionTitle: currentSection.title,
          }))
          .find((exercise) => exercise.status !== "completed")
      : orderedExercises.find((exercise) => exercise.status !== "completed"));

  const continueJourney = nextIncompleteExercise
    ? {
        exerciseId: nextIncompleteExercise.id,
        exerciseTitle: nextIncompleteExercise.title,
        sectionId: nextIncompleteExercise.sectionId,
        sectionTitle: nextIncompleteExercise.sectionTitle,
        durationMin: nextIncompleteExercise.durationMin,
        status: nextIncompleteExercise.status,
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
