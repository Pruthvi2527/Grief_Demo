"use client";

import type { Control, FieldPath } from "react-hook-form";
import { Controller } from "react-hook-form";

import { OptionGroup } from "@/features/onboarding/components/option-group";

import { ASSESSMENT_QUESTION_KEYS } from "../lib/question-keys";
import {
  CURRENT_FEELINGS_OPTIONS,
  ENERGY_LEVEL_OPTIONS,
  GRIEF_WEIGHT_OPTIONS,
  type AssessmentWizardValues,
} from "../schemas";
import { QuestionCard } from "./question-card";

type StepProps = {
  control: Control<AssessmentWizardValues>;
  error?: string;
};

export function CurrentFeelingsQuestion({ control, error }: StepProps) {
  return (
    <QuestionCard
      title="How do you feel right now?"
      instruction="Select all that apply"
      error={error}
    >
      <Controller
        control={control}
        name={
          ASSESSMENT_QUESTION_KEYS.currentFeelings as FieldPath<AssessmentWizardValues>
        }
        render={({ field }) => (
          <OptionGroup
            mode="multiple"
            options={CURRENT_FEELINGS_OPTIONS}
            value={field.value as string[]}
            onChange={field.onChange}
          />
        )}
      />
    </QuestionCard>
  );
}

export function GriefWeightQuestion({ control, error }: StepProps) {
  return (
    <QuestionCard
      title="What feels heaviest today?"
      instruction="Select one"
      error={error}
    >
      <Controller
        control={control}
        name={
          ASSESSMENT_QUESTION_KEYS.griefWeight as FieldPath<AssessmentWizardValues>
        }
        render={({ field }) => (
          <OptionGroup
            mode="single"
            options={GRIEF_WEIGHT_OPTIONS}
            value={field.value as string}
            onChange={field.onChange}
          />
        )}
      />
    </QuestionCard>
  );
}

export function EnergyLevelQuestion({ control, error }: StepProps) {
  return (
    <QuestionCard
      title="How is your energy lately?"
      instruction="Select one"
      error={error}
    >
      <Controller
        control={control}
        name={
          ASSESSMENT_QUESTION_KEYS.energyLevel as FieldPath<AssessmentWizardValues>
        }
        render={({ field }) => (
          <OptionGroup
            mode="single"
            options={ENERGY_LEVEL_OPTIONS}
            value={field.value as string}
            onChange={field.onChange}
          />
        )}
      />
    </QuestionCard>
  );
}

type WelcomeStepProps = {
  userName?: string | null;
};

export function WelcomeStep({ userName }: WelcomeStepProps) {
  return (
    <QuestionCard
      title="Emotional assessment"
      description={
        userName
          ? `${userName.split(" ")[0]}, these questions help us understand how you're feeling today so we can recommend exercises that meet you where you are.`
          : "These questions help us understand how you're feeling today so we can recommend exercises that meet you where you are."
      }
    >
      <div />
    </QuestionCard>
  );
}

export function CompleteStep({ values }: { values: AssessmentWizardValues }) {
  const feelings = CURRENT_FEELINGS_OPTIONS.filter((option) =>
    values.current_feelings.includes(option.value),
  ).map((option) => option.label);

  const weight = GRIEF_WEIGHT_OPTIONS.find(
    (option) => option.value === values.grief_weight,
  )?.label;

  const energy = ENERGY_LEVEL_OPTIONS.find(
    (option) => option.value === values.energy_level,
  )?.label;

  return (
    <QuestionCard
      title="Thank you for sharing"
      description="Your responses help personalize your course. We'll use them to guide you toward exercises that support you best."
    >
      <dl className="space-y-4 rounded-2xl border border-onboarding-border bg-white p-6">
        <div>
          <dt className="text-sm text-onboarding-muted">Current feelings</dt>
          <dd className="mt-1 font-medium">{feelings.join(", ") || "—"}</dd>
        </div>
        <div>
          <dt className="text-sm text-onboarding-muted">Heaviest today</dt>
          <dd className="mt-1 font-medium">{weight ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-sm text-onboarding-muted">Energy level</dt>
          <dd className="mt-1 font-medium">{energy ?? "—"}</dd>
        </div>
      </dl>
    </QuestionCard>
  );
}
