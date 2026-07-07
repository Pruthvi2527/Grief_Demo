import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { ExerciseNavigation } from "../types";

type ExerciseNavigationBarProps = {
  navigation: ExerciseNavigation;
};

export function ExerciseNavigationBar({ navigation }: ExerciseNavigationBarProps) {
  return (
    <nav
      aria-label="Exercise navigation"
      className="flex flex-wrap items-center justify-between gap-4"
    >
      <div>
        {navigation.previousExerciseId ? (
          <Link
            href={`/exercises/${navigation.previousExerciseId}`}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "h-10 px-0 text-onboarding-muted hover:text-onboarding-foreground",
            )}
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            {navigation.previousExerciseTitle}
          </Link>
        ) : (
          <Link
            href="/dashboard"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "h-10 px-0 text-onboarding-muted hover:text-onboarding-foreground",
            )}
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            My Tree
          </Link>
        )}
      </div>

      <p className="text-sm text-onboarding-muted">
        Exercise {navigation.positionInCourse} of {navigation.totalExercises}
      </p>

      <div>
        {navigation.nextExerciseId ? (
          <Link
            href={`/exercises/${navigation.nextExerciseId}`}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "h-10 px-0 text-onboarding-muted hover:text-onboarding-foreground",
            )}
          >
            {navigation.nextExerciseTitle}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        ) : (
          <span className="text-sm text-onboarding-muted/70">End of course</span>
        )}
      </div>
    </nav>
  );
}
