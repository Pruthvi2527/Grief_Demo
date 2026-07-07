"use client";

import {
  GRIEVING_WHO_OPTIONS,
  LOSS_TIMELINE_OPTIONS,
  type OnboardingWizardValues,
} from "../../schemas";
import { StepHeader } from "../step-progress";

type CompleteStepProps = {
  values: OnboardingWizardValues;
};

function getLabels(
  options: ReadonlyArray<{ value: string; label: string }>,
  values: string | string[],
) {
  const selected = Array.isArray(values) ? values : [values];
  return options
    .filter((option) => selected.includes(option.value))
    .map((option) => option.label);
}

export function CompleteStep({ values }: CompleteStepProps) {
  const grieving = getLabels(GRIEVING_WHO_OPTIONS, values.grieving_who);
  const timeline = getLabels(LOSS_TIMELINE_OPTIONS, values.loss_timeline);

  return (
    <div className="space-y-8">
      <StepHeader
        title="You're all set"
        description="Thank you for sharing. Next, we'll ask a few questions about how you're feeling."
      />
      <dl className="space-y-4 rounded-2xl border border-onboarding-border bg-white p-6">
        <div>
          <dt className="text-sm text-onboarding-muted">Grieving</dt>
          <dd className="mt-1 font-medium">{grieving.join(", ") || "—"}</dd>
        </div>
        <div>
          <dt className="text-sm text-onboarding-muted">Timeline</dt>
          <dd className="mt-1 font-medium">{timeline[0] ?? "—"}</dd>
        </div>
      </dl>
    </div>
  );
}
