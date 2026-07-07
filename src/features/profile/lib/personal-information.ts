import {
  GRIEVING_WHO_OPTIONS,
  LOSS_TIMELINE_OPTIONS,
} from "@/features/onboarding/schemas/onboarding.schema";
import type { OnboardingWizardValues } from "@/features/onboarding/schemas/onboarding.schema";

export type PersonalInformationItem = {
  label: string;
  value: string | null;
};

const EMPTY_VALUE = "Not provided";

function mapOptionLabel<T extends { value: string; label: string }>(
  options: readonly T[],
  value: string,
): string | null {
  return options.find((option) => option.value === value)?.label ?? null;
}

export function buildPersonalInformation(
  answers: Partial<OnboardingWizardValues>,
): PersonalInformationItem[] {
  const grievingValues = answers.grieving_who ?? [];
  const grievingLabels = grievingValues
    .map((value) => mapOptionLabel(GRIEVING_WHO_OPTIONS, value))
    .filter((label): label is string => Boolean(label));

  const timelineLabel = answers.loss_timeline
    ? mapOptionLabel(LOSS_TIMELINE_OPTIONS, answers.loss_timeline)
    : null;

  return [
    {
      label: "Person Lost",
      value: grievingLabels[0] ?? null,
    },
    {
      label: "Relationship",
      value: grievingLabels.length > 0 ? grievingLabels.join(", ") : null,
    },
    {
      label: "Time Since Loss",
      value: timelineLabel,
    },
    {
      label: "Circumstances of Loss",
      value: null,
    },
    {
      label: "Healing Goal",
      value: null,
    },
  ];
}

export function formatPersonalInformationValue(value: string | null): string {
  return value?.trim() ? value : EMPTY_VALUE;
}

export function hasPersonalInformation(items: PersonalInformationItem[]): boolean {
  return items.some((item) => Boolean(item.value?.trim()));
}
