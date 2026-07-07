import { AUTH_ROUTES } from "@/features/auth/lib/routes";

import type { Profile } from "../types";

export function getPostAuthRedirectPath(profile: Profile): string {
  if (!profile.onboarding_completed) {
    return AUTH_ROUTES.onboarding;
  }

  if (!profile.assessment_completed) {
    return AUTH_ROUTES.assessment;
  }

  return AUTH_ROUTES.dashboard;
}
