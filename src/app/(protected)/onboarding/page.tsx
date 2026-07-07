import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AUTH_ROUTES } from "@/features/auth/lib/routes";
import { OnboardingWizard } from "@/features/onboarding/components";
import { loadOnboardingPageData } from "@/features/onboarding/lib/load-onboarding-page";
import { getPostAuthRedirectPath } from "@/features/profile/lib/redirects";

export const metadata: Metadata = {
  title: "Onboarding",
  description: "Personalize your grief journey",
};

export default async function OnboardingPage() {
  const data = await loadOnboardingPageData();

  if (data.status === "unauthenticated") {
    redirect(AUTH_ROUTES.login);
  }

  if (data.profile.onboarding_completed) {
    redirect(getPostAuthRedirectPath(data.profile));
  }

  return (
    <OnboardingWizard
      initialAnswers={data.answers}
      userName={data.profile.full_name}
    />
  );
}
