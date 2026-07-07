import type { OnboardingQuestionKey } from "./question-keys";
import { ONBOARDING_QUESTION_KEYS } from "./question-keys";

export type OnboardingStepId =
  | "welcome"
  | "grieving_who"
  | "loss_timeline"
  | "complete";

export type OnboardingStepConfig = {
  id: OnboardingStepId;
  title: string;
  description?: string;
  instruction?: string;
  questionKey?: OnboardingQuestionKey;
  saveOnExit: boolean;
};

export const ONBOARDING_STEPS: OnboardingStepConfig[] = [
  {
    id: "welcome",
    title: "Welcome to bonds",
    description:
      "We'll ask a few gentle questions to personalize your grief journey. You can take your time.",
    saveOnExit: false,
  },
  {
    id: "grieving_who",
    title: "Who are you grieving?",
    instruction: "Select all that apply",
    questionKey: ONBOARDING_QUESTION_KEYS.grievingWho,
    saveOnExit: true,
  },
  {
    id: "loss_timeline",
    title: "When did you lose your person?",
    instruction: "Select one",
    questionKey: ONBOARDING_QUESTION_KEYS.lossTimeline,
    saveOnExit: true,
  },
  {
    id: "complete",
    title: "You're all set",
    description:
      "Thank you for sharing. Next, we'll ask a few questions about how you're feeling.",
    saveOnExit: false,
  },
];

export const ONBOARDING_TOTAL_STEPS = ONBOARDING_STEPS.length;
