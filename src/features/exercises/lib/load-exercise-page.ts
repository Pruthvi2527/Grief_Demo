import { ProfileService } from "@/features/profile/services/profile.service";
import { getUser } from "@/lib/supabase/auth";

import { ExerciseService } from "../services/exercise.service";

export async function loadExercisePageData(exerciseId: string) {
  const user = await getUser();

  if (!user) {
    return { status: "unauthenticated" as const };
  }

  const profileService = await ProfileService.create();
  const profile = await profileService.findByUserId(user.id);

  if (!profile?.onboarding_completed) {
    return { status: "needs_onboarding" as const };
  }

  if (!profile?.assessment_completed) {
    return { status: "needs_assessment" as const };
  }

  const exerciseService = await ExerciseService.create();
  const data = await exerciseService.getExercisePageData(
    user.id,
    exerciseId,
    profile.full_name,
  );

  if (!data) {
    return { status: "not_found" as const };
  }

  return {
    status: "ready" as const,
    data,
  };
}
