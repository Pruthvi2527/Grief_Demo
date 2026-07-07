import type { AssessmentQuestionKey } from "./question-keys";
import { ASSESSMENT_QUESTION_KEYS } from "./question-keys";

export type AssessmentStepId =
  | "welcome"
  | "current_feelings"
  | "grief_weight"
  | "energy_level"
  | "complete";

export type AssessmentStepConfig = {
  id: AssessmentStepId;
  title: string;
  description?: string;
  instruction?: string;
  questionKey?: AssessmentQuestionKey;
  saveOnExit: boolean;
};

export const ASSESSMENT_STEPS: AssessmentStepConfig[] = [
  {
    id: "welcome",
    title: "Emotional assessment",
    description:
      "These questions help us understand how you're feeling today so we can recommend exercises that meet you where you are.",
    saveOnExit: false,
  },
  {
    id: "current_feelings",
    title: "How do you feel right now?",
    instruction: "Select all that apply",
    questionKey: ASSESSMENT_QUESTION_KEYS.currentFeelings,
    saveOnExit: true,
  },
  {
    id: "grief_weight",
    title: "What feels heaviest today?",
    instruction: "Select one",
    questionKey: ASSESSMENT_QUESTION_KEYS.griefWeight,
    saveOnExit: true,
  },
  {
    id: "energy_level",
    title: "How is your energy lately?",
    instruction: "Select one",
    questionKey: ASSESSMENT_QUESTION_KEYS.energyLevel,
    saveOnExit: true,
  },
  {
    id: "complete",
    title: "Thank you for sharing",
    description:
      "Your responses help personalize your course. We'll use them to guide you toward exercises that support you best.",
    saveOnExit: false,
  },
];

export const ASSESSMENT_TOTAL_STEPS = ASSESSMENT_STEPS.length;
