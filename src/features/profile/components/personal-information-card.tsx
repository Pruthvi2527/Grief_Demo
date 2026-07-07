import type { PersonalInformationItem } from "../lib/personal-information";
import { formatPersonalInformationValue } from "../lib/personal-information";
import { ProfileCard, ProfileInfoRow } from "./profile-card";

type PersonalInformationCardProps = {
  items: PersonalInformationItem[];
  hasPersonalInformation: boolean;
};

export function PersonalInformationCard({
  items,
  hasPersonalInformation,
}: PersonalInformationCardProps) {
  return (
    <ProfileCard
      title="Personal Information"
      description="Details shared during onboarding to personalize your journey."
    >
      {!hasPersonalInformation ? (
        <p className="rounded-xl border border-dashed border-onboarding-border bg-onboarding-surface/40 px-4 py-6 text-sm text-onboarding-muted">
          You have not added personal information yet. Complete onboarding to
          personalize your course experience.
        </p>
      ) : (
        <div>
          {items.map((item) => (
            <ProfileInfoRow
              key={item.label}
              label={item.label}
              value={formatPersonalInformationValue(item.value)}
            />
          ))}
        </div>
      )}
    </ProfileCard>
  );
}
