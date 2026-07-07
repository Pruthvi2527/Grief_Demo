export type ExerciseProgressStatus = "not_started" | "in_progress" | "completed";

export type ExerciseSummary = {
  id: string;
  sectionId: string;
  title: string;
  description: string | null;
  durationMin: number | null;
  orderIndex: number;
  status: ExerciseProgressStatus;
};

export type SectionSummary = {
  id: string;
  title: string;
  description: string | null;
  orderIndex: number;
  exerciseCount: number;
  completedCount: number;
  isLocked: boolean;
  isCurrent: boolean;
  exercises: ExerciseSummary[];
};

export type ContinueJourney = {
  exerciseId: string;
  exerciseTitle: string;
  sectionId: string;
  sectionTitle: string;
  durationMin: number | null;
  status: ExerciseProgressStatus;
} | null;

export type DashboardData = {
  userName: string | null;
  overallProgressPercent: number;
  totalExercises: number;
  completedExercises: number;
  currentSection: SectionSummary | null;
  continueJourney: ContinueJourney;
  sections: SectionSummary[];
  /** Week 2+: optional AI-recommended exercise id for dashboard highlighting. */
  recommendedExerciseId?: string | null;
};
