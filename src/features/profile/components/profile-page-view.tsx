import { DashboardShell } from "@/features/dashboard/components";

import type { ProfilePageData } from "../types/profile-page";
import { AccountSettingsCard } from "./account-settings-card";
import { JourneySummaryCard } from "./journey-summary-card";
import { PersonalInformationCard } from "./personal-information-card";
import { ProfileHeader, ProfileIdentityCard } from "./profile-header";

type ProfilePageViewProps = {
  data: ProfilePageData;
};

export function ProfilePageView({ data }: ProfilePageViewProps) {
  return (
    <DashboardShell activeNav="profile">
      <div className="space-y-10">
        <ProfileHeader />

        <div className="grid gap-6 xl:grid-cols-2">
          <ProfileIdentityCard data={data} />
          <JourneySummaryCard journey={data.journey} memberSince={data.memberSince} />
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <PersonalInformationCard
            items={data.personalInformation}
            hasPersonalInformation={data.hasPersonalInformation}
          />
          <AccountSettingsCard />
        </div>
      </div>
    </DashboardShell>
  );
}
