import { Sparkles } from "lucide-react";

type PersonalizedIntroductionProps = {
  /**
   * Week 2: populated by AI-generated framing from ExerciseService.
   */
  introduction: string;
};

export function PersonalizedIntroduction({
  introduction,
}: PersonalizedIntroductionProps) {
  return (
    <section
      aria-labelledby="personalized-intro-heading"
      className="rounded-2xl border border-onboarding-primary/15 bg-onboarding-primary/5 p-6"
    >
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-onboarding-primary/10">
          <Sparkles className="size-5 text-onboarding-primary" aria-hidden="true" />
        </div>
        <div className="space-y-2">
          <h2
            id="personalized-intro-heading"
            className="text-sm font-semibold uppercase tracking-[0.14em] text-onboarding-primary"
          >
            For you
          </h2>
          <p className="text-base leading-relaxed text-onboarding-foreground">
            {introduction}
          </p>
        </div>
      </div>
    </section>
  );
}
