import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { ExerciseView } from "@/features/exercises/components";
import { loadExercisePageData } from "@/features/exercises/lib/load-exercise-page";

type ExercisePageProps = {
  params: Promise<{ exerciseId: string }>;
};

export async function generateMetadata({
  params,
}: ExercisePageProps): Promise<Metadata> {
  const { exerciseId } = await params;
  const result = await loadExercisePageData(exerciseId);

  if (result.status !== "ready") {
    return { title: "Exercise" };
  }

  return {
    title: result.data.exercise.title,
    description: result.data.exercise.description ?? "Course exercise",
  };
}

export default async function ExercisePage({ params }: ExercisePageProps) {
  const { exerciseId } = await params;
  const result = await loadExercisePageData(exerciseId);

  if (result.status === "unauthenticated") {
    redirect("/login");
  }

  if (result.status === "needs_onboarding") {
    redirect("/onboarding");
  }

  if (result.status === "needs_assessment") {
    redirect("/assessment");
  }

  if (result.status === "not_found") {
    notFound();
  }

  return <ExerciseView data={result.data} />;
}
