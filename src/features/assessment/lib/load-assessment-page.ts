import { ProfileService } from "@/features/profile/services/profile.service";
import { getUser } from "@/lib/supabase/auth";

import { AssessmentService } from "../services/assessment.service";

export async function loadAssessmentPageData() {
  const user = await getUser();

  if (!user) {
    return { status: "unauthenticated" as const };
  }

  const profileService = await ProfileService.create();
  const assessmentService = await AssessmentService.create();

  const profile = await profileService.findByUserId(user.id);

  if (!profile?.onboarding_completed) {
    return { status: "needs_onboarding" as const };
  }

  if (profile.assessment_completed) {
    return { status: "completed" as const };
  }

  let answers = {};

  try {
    answers = await assessmentService.getInitialAnswers(user.id);
  } catch (error) {
    console.error("Failed to load assessment answers:", error);
  }

  return {
    status: "ready" as const,
    profile,
    answers,
  };
}
