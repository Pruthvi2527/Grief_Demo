import type { User } from "@supabase/supabase-js";

import { DashboardService } from "@/features/dashboard/services/dashboard.service";
import { OnboardingService } from "@/features/onboarding/services/onboarding.service";

import {
  formatMemberSince,
  resolveAuthProvider,
} from "../lib/profile-formatters";
import {
  buildPersonalInformation,
  hasPersonalInformation,
} from "../lib/personal-information";
import type { ProfilePageData } from "../types/profile-page";
import { ProfileService } from "./profile.service";

export class ProfilePageService {
  constructor(
    private readonly profileService: ProfileService,
    private readonly onboardingService: OnboardingService,
    private readonly dashboardService: DashboardService,
  ) {}

  static async create() {
    const profileService = await ProfileService.create();
    const onboardingService = await OnboardingService.create();
    const dashboardService = await DashboardService.create();

    return new ProfilePageService(
      profileService,
      onboardingService,
      dashboardService,
    );
  }

  async getProfilePageData(user: User): Promise<ProfilePageData | null> {
    const profile = await this.profileService.findByUserId(user.id);

    if (!profile) {
      return null;
    }

    const [onboardingAnswers, dashboardData] = await Promise.all([
      this.onboardingService.getAnswersMap(user.id),
      this.dashboardService.getDashboardData(user.id, profile.full_name),
    ]);

    const personalInformation = buildPersonalInformation(onboardingAnswers);

    return {
      fullName: profile.full_name,
      email: profile.email ?? user.email ?? null,
      avatarUrl: profile.avatar_url,
      authProvider: resolveAuthProvider(user),
      memberSince: formatMemberSince(profile.created_at),
      journey: {
        overallProgressPercent: dashboardData.overallProgressPercent,
        completedExercises: dashboardData.completedExercises,
        totalExercises: dashboardData.totalExercises,
        currentSectionTitle: dashboardData.currentSection?.title ?? null,
        currentExerciseTitle: dashboardData.continueJourney?.exerciseTitle ?? null,
      },
      personalInformation,
      hasPersonalInformation: hasPersonalInformation(personalInformation),
    };
  }
}
