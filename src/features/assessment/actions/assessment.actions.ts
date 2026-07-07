"use server";

import { redirect } from "next/navigation";

import { AUTH_ROUTES } from "@/features/auth/lib/routes";
import { getUser } from "@/lib/supabase/auth";

import type { AssessmentQuestionKey } from "../lib/question-keys";
import { AssessmentService } from "../services/assessment.service";

export async function saveAssessmentStep(
  questionKey: AssessmentQuestionKey,
  value: string | string[],
) {
  const user = await getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const service = await AssessmentService.create();
  await service.saveAnswer(user.id, questionKey, value);
}

export async function completeAssessment() {
  const user = await getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const service = await AssessmentService.create();
  await service.completeAssessment(user.id);

  redirect(AUTH_ROUTES.dashboard);
}
