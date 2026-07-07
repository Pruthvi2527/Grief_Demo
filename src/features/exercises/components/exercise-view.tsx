import type { ExercisePageData } from "../types";
import { BackToDashboardLink } from "./back-to-dashboard-link";
import { CompleteExerciseButton } from "./complete-exercise-button";
import { ExerciseContent } from "./exercise-content";
import { ExerciseNavigationBar } from "./exercise-navigation-bar";
import { ExerciseShell } from "./exercise-shell";
import { PersonalizedIntroduction } from "./personalized-introduction";

type ExerciseViewProps = {
  data: ExercisePageData;
};

export function ExerciseView({ data }: ExerciseViewProps) {
  const isCompleted = data.progress.status === "completed";

  return (
    <ExerciseShell
      section={data.section}
      progress={data.progress}
      footer={
        <div className="space-y-5">
          <ExerciseNavigationBar navigation={data.navigation} />
          <CompleteExerciseButton
            exerciseId={data.exercise.id}
            isCompleted={isCompleted}
            nextExerciseId={data.navigation.nextExerciseId}
            nextExerciseTitle={data.navigation.nextExerciseTitle}
          />
        </div>
      }
    >
      <article className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <header className="space-y-4">
          <BackToDashboardLink exerciseId={data.exercise.id} />
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-onboarding-muted">
            {data.section.title}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-onboarding-foreground sm:text-4xl">
            {data.exercise.title}
          </h1>
          {data.exercise.description ? (
            <p className="text-lg leading-relaxed text-onboarding-muted">
              {data.exercise.description}
            </p>
          ) : null}
        </header>

        <PersonalizedIntroduction introduction={data.personalizedIntroduction} />

        <ExerciseContent exercise={data.exercise} />
      </article>
    </ExerciseShell>
  );
}
