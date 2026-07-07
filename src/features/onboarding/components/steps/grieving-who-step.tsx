"use client";

import type { Control, FieldPath } from "react-hook-form";
import { Controller } from "react-hook-form";

import { ONBOARDING_QUESTION_KEYS } from "../../lib/question-keys";
import {
  GRIEVING_WHO_OPTIONS,
  type OnboardingWizardValues,
} from "../../schemas";
import { OptionGroup } from "../option-group";
import { StepHeader } from "../step-progress";

type GrievingWhoStepProps = {
  control: Control<OnboardingWizardValues>;
  error?: string;
};

export function GrievingWhoStep({ control, error }: GrievingWhoStepProps) {
  return (
    <div className="space-y-8">
      <StepHeader
        title="Who are you grieving?"
        instruction="Select all that apply"
      />
      <Controller
        control={control}
        name={
          ONBOARDING_QUESTION_KEYS.grievingWho as FieldPath<OnboardingWizardValues>
        }
        render={({ field }) => (
          <OptionGroup
            mode="multiple"
            options={GRIEVING_WHO_OPTIONS}
            value={field.value as string[]}
            onChange={field.onChange}
          />
        )}
      />
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
