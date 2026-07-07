import { z } from "zod";

import { ONBOARDING_QUESTION_KEYS } from "../lib/question-keys";

export const GRIEVING_WHO_OPTIONS = [
  { value: "partner", label: "My partner" },
  { value: "mother", label: "My mother" },
  { value: "father", label: "My father" },
  { value: "child", label: "My child" },
  { value: "sibling", label: "My sibling" },
  { value: "friend", label: "My friend" },
  { value: "other", label: "Someone else I loved" },
] as const;

export const LOSS_TIMELINE_OPTIONS = [
  { value: "less_than_3_months", label: "Less than 3 months" },
  { value: "3_to_6_months", label: "3–6 months" },
  { value: "6_to_12_months", label: "6–12 months" },
  { value: "1_to_3_years", label: "1–3 years" },
  { value: "3_plus_years", label: "3+ years" },
] as const;

export const welcomeStepSchema = z.object({});

export const grievingWhoStepSchema = z.object({
  [ONBOARDING_QUESTION_KEYS.grievingWho]: z
    .array(z.string())
    .min(1, "Select at least one person"),
});

export const lossTimelineStepSchema = z.object({
  [ONBOARDING_QUESTION_KEYS.lossTimeline]: z
    .string()
    .min(1, "Select when you lost your person"),
});

export const onboardingWizardSchema = z.object({
  [ONBOARDING_QUESTION_KEYS.grievingWho]: z.array(z.string()).default([]),
  [ONBOARDING_QUESTION_KEYS.lossTimeline]: z.string().default(""),
});

export type OnboardingWizardValues = z.infer<typeof onboardingWizardSchema>;

export const STEP_SCHEMAS = {
  welcome: welcomeStepSchema,
  grieving_who: grievingWhoStepSchema,
  loss_timeline: lossTimelineStepSchema,
  complete: welcomeStepSchema,
} as const;
