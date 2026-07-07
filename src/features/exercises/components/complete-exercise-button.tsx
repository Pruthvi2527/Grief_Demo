"use client";

import { useFormStatus } from "react-dom";
import { CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";

import { completeExercise } from "../actions/exercise.actions";

type CompleteExerciseButtonProps = {
  exerciseId: string;
  isCompleted: boolean;
  nextExerciseId: string | null;
  nextExerciseTitle: string | null;
};

function SubmitButton({ isCompleted }: { isCompleted: boolean }) {
  const { pending } = useFormStatus();

  if (isCompleted) {
    return (
      <span className="inline-flex items-center gap-2 text-sm font-medium text-onboarding-primary">
        <CheckCircle2 className="size-5" aria-hidden="true" />
        Completed
      </span>
    );
  }

  return (
    <Button
      type="submit"
      disabled={pending}
      className="h-11 bg-onboarding-primary px-8 text-white hover:bg-onboarding-primary/90"
    >
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          Saving progress...
        </>
      ) : (
        "Complete exercise"
      )}
    </Button>
  );
}

export function CompleteExerciseButton({
  exerciseId,
  isCompleted,
  nextExerciseId,
  nextExerciseTitle,
}: CompleteExerciseButtonProps) {
  const completeExerciseAction = completeExercise.bind(null, exerciseId);

  return (
    <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
      <form action={completeExerciseAction}>
        <SubmitButton isCompleted={isCompleted} />
      </form>

      {isCompleted && nextExerciseId ? (
        <Link
          href={`/exercises/${nextExerciseId}`}
          className={buttonVariants({
            variant: "outline",
            className: "h-11 border-onboarding-border",
          })}
        >
          Next: {nextExerciseTitle}
        </Link>
      ) : null}

      {isCompleted && !nextExerciseId ? (
        <Link
          href="/dashboard"
          className={buttonVariants({
            variant: "outline",
            className: "h-11 border-onboarding-border",
          })}
        >
          Back to My Tree
        </Link>
      ) : null}
    </div>
  );
}
