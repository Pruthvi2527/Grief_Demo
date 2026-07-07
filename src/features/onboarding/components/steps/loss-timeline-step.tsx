"use client";

import type { Control, FieldPath } from "react-hook-form";
import { Controller } from "react-hook-form";

import { ONBOARDING_QUESTION_KEYS } from "../../lib/question-keys";
import {
  LOSS_TIMELINE_OPTIONS,
  type OnboardingWizardValues,
} from "../../schemas";
import { OptionGroup } from "../option-group";
import { StepHeader } from "../step-progress";

type LossTimelineStepProps = {
  control: Control<OnboardingWizardValues>;
  error?: string;
};

export function LossTimelineStep({ control, error }: LossTimelineStepProps) {
  return (
    <div className="space-y-8">
      <StepHeader
        title="When did you lose your person?"
        instruction="Select one"
      />
      <Controller
        control={control}
        name={
          ONBOARDING_QUESTION_KEYS.lossTimeline as FieldPath<OnboardingWizardValues>
        }
        render={({ field }) => (
          <OptionGroup
            mode="single"
            options={LOSS_TIMELINE_OPTIONS}
            value={field.value as string}
            onChange={field.onChange}
          />
        )}
      />
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
