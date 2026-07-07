export const ONBOARDING_QUESTION_KEYS = {
  grievingWho: "grieving_who",
  lossTimeline: "loss_timeline",
  currentFeelings: "current_feelings",
} as const;

export type OnboardingQuestionKey =
  (typeof ONBOARDING_QUESTION_KEYS)[keyof typeof ONBOARDING_QUESTION_KEYS];
