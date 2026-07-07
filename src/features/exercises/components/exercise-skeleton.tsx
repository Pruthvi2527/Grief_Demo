import { ExerciseShell } from "./exercise-shell";

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-onboarding-border/50 ${className ?? ""}`}
    />
  );
}

export function ExerciseSkeleton() {
  return (
    <ExerciseShell
      section={{ id: "", title: "Loading section", orderIndex: 0 }}
      progress={{
        status: "in_progress",
        overallProgressPercent: 0,
        completedExercises: 0,
        totalExercises: 0,
      }}
    >
      <div className="mx-auto w-full max-w-3xl space-y-8" aria-busy="true" aria-label="Loading exercise">
        <div className="space-y-4">
          <SkeletonBlock className="h-4 w-32" />
          <SkeletonBlock className="h-10 w-full max-w-xl" />
          <SkeletonBlock className="h-6 w-full max-w-2xl" />
        </div>
        <SkeletonBlock className="h-36" />
        <SkeletonBlock className="h-64" />
      </div>
    </ExerciseShell>
  );
}
