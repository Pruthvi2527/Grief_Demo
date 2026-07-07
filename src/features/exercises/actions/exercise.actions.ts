"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { AUTH_ROUTES } from "@/features/auth/lib/routes";
import { getUser } from "@/lib/supabase/auth";

import { ExerciseService } from "../services/exercise.service";

export async function preserveExerciseProgress(exerciseId: string) {
  const user = await getUser();

  if (!user) {
    return;
  }

  const service = await ExerciseService.create();
  await service.markStarted(user.id, exerciseId);
}

export async function completeExercise(exerciseId: string) {
  const user = await getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const service = await ExerciseService.create();
  const { nextExerciseId } = await service.markCompleted(user.id, exerciseId);

  revalidatePath(AUTH_ROUTES.dashboard);
  revalidatePath(`/exercises/${exerciseId}`);

  if (nextExerciseId) {
    revalidatePath(`/exercises/${nextExerciseId}`);
    redirect(`/exercises/${nextExerciseId}`);
  }

  redirect(AUTH_ROUTES.dashboard);
}
