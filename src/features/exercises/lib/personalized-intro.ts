/**
 * Week 2: replace with AI-generated framing from onboarding + assessment context.
 * `ExerciseService.resolvePersonalizedIntroduction` will call the AI provider first.
 */
export function getPersonalizedIntroductionPlaceholder(
  exerciseTitle: string,
  sectionTitle: string,
  userName: string | null,
): string {
  const firstName = userName?.trim().split(/\s+/)[0];

  if (firstName) {
    return `${firstName}, as you begin "${exerciseTitle}" in ${sectionTitle}, remember that healing is not linear. This exercise is here to meet you where you are — take your time, and pause whenever you need to.`;
  }

  return `As you begin "${exerciseTitle}" in ${sectionTitle}, remember that healing is not linear. This exercise is here to meet you where you are — take your time, and pause whenever you need to.`;
}
