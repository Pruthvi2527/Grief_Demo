import type { DashboardData } from "../types";
import { ContinueJourneyCard } from "./continue-journey-card";
import { CourseSectionsAccordion } from "./course-sections-accordion";
import { DashboardShell } from "./dashboard-shell";
import { ProgressRing } from "./progress-ring";
import { UserGreeting } from "./user-greeting";

type DashboardViewProps = {
  data: DashboardData;
};

export function DashboardView({ data }: DashboardViewProps) {
  return (
    <DashboardShell activeNav="tree">
      <div className="space-y-10">
        <UserGreeting name={data.userName} />

        <div className="grid gap-8 xl:grid-cols-[minmax(0,320px)_minmax(0,1fr)] xl:items-start">
          <section
            aria-labelledby="overall-progress-heading"
            className="rounded-2xl border border-onboarding-border bg-white/80 p-6 sm:p-8"
          >
            <h2
              id="overall-progress-heading"
              className="mb-6 text-lg font-semibold text-onboarding-foreground"
            >
              Overall progress
            </h2>
            <ProgressRing
              percent={data.overallProgressPercent}
              completedExercises={data.completedExercises}
              totalExercises={data.totalExercises}
            />

            {data.currentSection ? (
              <div className="mt-8 rounded-xl bg-onboarding-surface/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-onboarding-muted">
                  Current section
                </p>
                <p className="mt-1 text-base font-medium text-onboarding-foreground">
                  {data.currentSection.title}
                </p>
                <p className="mt-1 text-sm text-onboarding-muted">
                  {data.currentSection.exerciseCount} exercise
                  {data.currentSection.exerciseCount === 1 ? "" : "s"} in this
                  section
                </p>
              </div>
            ) : null}
          </section>

          <ContinueJourneyCard continueJourney={data.continueJourney} />
        </div>

        <CourseSectionsAccordion
          sections={data.sections}
          currentExerciseId={data.continueJourney?.exerciseId ?? null}
          recommendedExerciseId={data.recommendedExerciseId ?? null}
        />
      </div>
    </DashboardShell>
  );
}
