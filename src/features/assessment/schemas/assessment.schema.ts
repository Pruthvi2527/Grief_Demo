import { z } from "zod";

import { ASSESSMENT_QUESTION_KEYS } from "../lib/question-keys";

export const CURRENT_FEELINGS_OPTIONS = [
  { value: "angry", label: "Angry" },
  { value: "overwhelmed", label: "Overwhelmed" },
  { value: "numb", label: "Numb" },
  { value: "guilty", label: "Guilty" },
  { value: "exhausted", label: "Exhausted" },
  { value: "calm", label: "Calm" },
  { value: "other", label: "Other" },
] as const;

export const GRIEF_WEIGHT_OPTIONS = [
  { value: "loneliness", label: "The loneliness" },
  { value: "sadness", label: "Intense sadness" },
  { value: "anger", label: "Anger or frustration" },
  { value: "guilt", label: "Guilt or regret" },
  { value: "anxiety", label: "Anxiety about the future" },
  { value: "numbness", label: "Numbness or disconnection" },
] as const;

export const ENERGY_LEVEL_OPTIONS = [
  { value: "exhausted", label: "Exhausted most days" },
  { value: "up_and_down", label: "Up and down" },
  { value: "steady", label: "Somewhat steady" },
  { value: "unsure", label: "I'm not sure" },
] as const;

export const welcomeStepSchema = z.object({});

export const currentFeelingsStepSchema = z.object({
  [ASSESSMENT_QUESTION_KEYS.currentFeelings]: z
    .array(z.string())
    .min(1, "Select at least one feeling"),
});

export const griefWeightStepSchema = z.object({
  [ASSESSMENT_QUESTION_KEYS.griefWeight]: z
    .string()
    .min(1, "Select what feels heaviest right now"),
});

export const energyLevelStepSchema = z.object({
  [ASSESSMENT_QUESTION_KEYS.energyLevel]: z
    .string()
    .min(1, "Select how your energy feels"),
});

export const assessmentWizardSchema = z.object({
  [ASSESSMENT_QUESTION_KEYS.currentFeelings]: z.array(z.string()).default([]),
  [ASSESSMENT_QUESTION_KEYS.griefWeight]: z.string().default(""),
  [ASSESSMENT_QUESTION_KEYS.energyLevel]: z.string().default(""),
});

export type AssessmentWizardValues = z.infer<typeof assessmentWizardSchema>;

export const STEP_SCHEMAS = {
  welcome: welcomeStepSchema,
  current_feelings: currentFeelingsStepSchema,
  grief_weight: griefWeightStepSchema,
  energy_level: energyLevelStepSchema,
  complete: welcomeStepSchema,
} as const;
