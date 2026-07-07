import type { PersonalInformationItem } from "../lib/personal-information";

export type JourneySummary = {
  overallProgressPercent: number;
  completedExercises: number;
  totalExercises: number;
  currentSectionTitle: string | null;
  currentExerciseTitle: string | null;
};

export type ProfilePageData = {
  fullName: string | null;
  email: string | null;
  avatarUrl: string | null;
  authProvider: "Google" | "Email";
  memberSince: string;
  journey: JourneySummary;
  personalInformation: PersonalInformationItem[];
  hasPersonalInformation: boolean;
};
