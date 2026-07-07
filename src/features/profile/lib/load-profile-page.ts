import { ProfileService } from "@/features/profile/services/profile.service";
import { getUser } from "@/lib/supabase/auth";

import { ProfilePageService } from "../services/profile-page.service";

export async function loadProfilePageData() {
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

  const profilePageService = await ProfilePageService.create();
  const data = await profilePageService.getProfilePageData(user);

  if (!data) {
    return { status: "empty" as const };
  }

  return {
    status: "ready" as const,
    data,
  };
}
