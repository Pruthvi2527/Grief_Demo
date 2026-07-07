import type { JourneySummary } from "../types/profile-page";
import { ProfileCard, ProfileInfoRow } from "./profile-card";

type JourneySummaryCardProps = {
  journey: JourneySummary;
  memberSince: string;
};

export function JourneySummaryCard({ journey, memberSince }: JourneySummaryCardProps) {
  const exercisesCompletedLabel =
    journey.totalExercises > 0
      ? `${journey.completedExercises} of ${journey.totalExercises}`
      : "0";

  return (
    <ProfileCard
      title="Journey Summary"
      description="Your progress through the grief course."
    >
      <div className="space-y-4">
        <ProfileInfoRow
          label="Overall Progress"
          value={`${journey.overallProgressPercent}%`}
        />
        <ProfileInfoRow label="Exercises Completed" value={exercisesCompletedLabel} />
        <ProfileInfoRow
          label="Current Section"
          value={journey.currentSectionTitle ?? "Not started"}
        />
        <ProfileInfoRow
          label="Current Exercise"
          value={journey.currentExerciseTitle ?? "Not started"}
        />
        <ProfileInfoRow label="Member Since" value={memberSince} />
      </div>
    </ProfileCard>
  );
}
