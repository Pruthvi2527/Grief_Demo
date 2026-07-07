export const ASSESSMENT_QUESTION_KEYS = {
  currentFeelings: "current_feelings",
  griefWeight: "grief_weight",
  energyLevel: "energy_level",
} as const;

export type AssessmentQuestionKey =
  (typeof ASSESSMENT_QUESTION_KEYS)[keyof typeof ASSESSMENT_QUESTION_KEYS];

export const ASSESSMENT_ROUTE = "/assessment";
