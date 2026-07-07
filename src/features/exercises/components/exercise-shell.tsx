import Link from "next/link";
import type { ReactNode } from "react";

import { ProgressRing } from "@/features/dashboard/components/progress-ring";
import { cn } from "@/lib/utils";

import type { ExerciseProgressSummary, ExerciseSection } from "../types";

type ExerciseShellProps = {
  section: ExerciseSection;
  progress: ExerciseProgressSummary;
  children: ReactNode;
  footer?: ReactNode;
};

export function ExerciseShell({
  section,
  progress,
  children,
  footer,
}: ExerciseShellProps) {
  return (
    <div className="min-h-screen bg-onboarding-background">
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[320px_1fr]">
        <aside className="hidden border-r border-onboarding-border/70 bg-onboarding-surface/40 lg:flex lg:flex-col">
          <div className="flex flex-col gap-8 p-8">
            <Link
              href="/dashboard"
              className="text-2xl font-semibold text-onboarding-primary"
            >
              bonds
            </Link>

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-onboarding-muted">
                Current section
              </p>
              <p className="text-lg font-semibold text-onboarding-foreground">
                {section.title}
              </p>
            </div>

            <div className="rounded-2xl border border-onboarding-border bg-white/80 p-5">
              <ProgressRing
                percent={progress.overallProgressPercent}
                completedExercises={progress.completedExercises}
                totalExercises={progress.totalExercises}
                size={140}
              />
            </div>
          </div>

          <div className="mt-auto p-8">
            <div className="rounded-2xl bg-gradient-to-br from-[#dfe8df] via-[#edf2e8] to-[#f6f1e8] p-6">
              <p className="text-sm leading-relaxed text-onboarding-primary/80">
                Pause whenever you need. Your progress is saved as you go.
              </p>
            </div>
          </div>
        </aside>

        <div className="flex min-h-screen flex-col">
          <header className="border-b border-onboarding-border/60 px-6 py-5 lg:hidden">
            <Link href="/dashboard" className="text-xl font-semibold text-onboarding-primary">
              bonds
            </Link>
          </header>

          <main className={cn("flex flex-1 flex-col px-6 py-8 sm:px-8 lg:px-12 lg:py-10")}>
            {children}
          </main>

          {footer ? (
            <footer className="sticky bottom-0 border-t border-onboarding-border/60 bg-onboarding-background/95 px-6 py-5 backdrop-blur sm:px-8 lg:px-12">
              {footer}
            </footer>
          ) : null}
        </div>
      </div>
    </div>
  );
}
