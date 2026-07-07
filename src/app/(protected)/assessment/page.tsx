import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AssessmentWizard } from "@/features/assessment/components";
import { loadAssessmentPageData } from "@/features/assessment/lib/load-assessment-page";
import { AUTH_ROUTES } from "@/features/auth/lib/routes";

export const metadata: Metadata = {
  title: "Emotional Assessment",
  description: "Share how you're feeling so we can personalize your journey",
};

export default async function AssessmentPage() {
  const data = await loadAssessmentPageData();

  if (data.status === "unauthenticated") {
    redirect(AUTH_ROUTES.login);
  }

  if (data.status === "needs_onboarding") {
    redirect(AUTH_ROUTES.onboarding);
  }

  if (data.status === "completed") {
    redirect(AUTH_ROUTES.dashboard);
  }

  return (
    <AssessmentWizard
      initialAnswers={data.answers}
      userName={data.profile.full_name}
    />
  );
}
