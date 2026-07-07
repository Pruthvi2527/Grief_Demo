import { ProfileService } from "@/features/profile/services/profile.service";
import { getUser } from "@/lib/supabase/auth";

import { DashboardService } from "../services/dashboard.service";

export async function loadDashboardPageData() {
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

  const dashboardService = await DashboardService.create();
  const hasContent = await dashboardService.hasCourseContent();

  if (!hasContent) {
    return {
      status: "empty" as const,
      userName: profile.full_name,
    };
  }

  const dashboard = await dashboardService.getDashboardData(
    user.id,
    profile.full_name,
  );

  return {
    status: "ready" as const,
    dashboard,
  };
}
