import { ProfileService } from "@/features/profile/services/profile.service";
import { getUser } from "@/lib/supabase/auth";

import { OnboardingService } from "../services/onboarding.service";
import type { OnboardingWizardValues } from "../schemas";
import type { Profile } from "@/features/profile/types";

export type OnboardingPageData =
  | { status: "unauthenticated" }
  | { status: "ready"; profile: Profile; answers: Partial<OnboardingWizardValues> };

export async function loadOnboardingPageData(): Promise<OnboardingPageData> {
  const user = await getUser();

  if (!user) {
    return { status: "unauthenticated" };
  }

  const profileService = await ProfileService.create();
  const onboardingService = await OnboardingService.create();

  const profile = await profileService.ensureProfile(user);

  let answers: Partial<OnboardingWizardValues> = {};

  try {
    answers = await onboardingService.getAnswersMap(user.id);
  } catch (error) {
    console.error("Failed to load onboarding answers:", error);
  }

  return {
    status: "ready",
    profile,
    answers,
  };
}
