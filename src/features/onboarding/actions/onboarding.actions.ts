"use server";

import { redirect } from "next/navigation";

import { AUTH_ROUTES } from "@/features/auth/lib/routes";
import { getUser } from "@/lib/supabase/auth";

import type { OnboardingQuestionKey } from "../lib/question-keys";
import { OnboardingService } from "../services/onboarding.service";

export async function saveOnboardingStep(
  questionKey: OnboardingQuestionKey,
  value: string | string[],
) {
  const user = await getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const service = await OnboardingService.create();
  await service.upsertAnswer(user.id, questionKey, value);
}

export async function completeOnboarding() {
  const user = await getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const service = await OnboardingService.create();
  await service.completeOnboarding(user.id);

  redirect(AUTH_ROUTES.assessment);
}
