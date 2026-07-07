import type { Database } from "@/types/database";

export type ExerciseContentType =
  Database["public"]["Enums"]["exercise_content_type"];

export type ExerciseProgressStatus =
  Database["public"]["Enums"]["exercise_progress_status"];

export type ExerciseDetail = {
  id: string;
  sectionId: string;
  title: string;
  description: string | null;
  contentType: ExerciseContentType;
  contentText: string | null;
  contentUrl: string | null;
  durationMin: number | null;
  orderIndex: number;
};

export type ExerciseSection = {
  id: string;
  title: string;
  orderIndex: number;
};

export type ExerciseNavigation = {
  previousExerciseId: string | null;
  previousExerciseTitle: string | null;
  nextExerciseId: string | null;
  nextExerciseTitle: string | null;
  positionInCourse: number;
  totalExercises: number;
};

export type ExerciseProgressSummary = {
  status: ExerciseProgressStatus;
  overallProgressPercent: number;
  completedExercises: number;
  totalExercises: number;
};

export type ExercisePageData = {
  exercise: ExerciseDetail;
  section: ExerciseSection;
  progress: ExerciseProgressSummary;
  navigation: ExerciseNavigation;
  personalizedIntroduction: string;
  userName: string | null;
};
