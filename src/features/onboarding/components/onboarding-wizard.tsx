"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import {
  completeOnboarding,
  saveOnboardingStep,
} from "../actions";
import {
  ONBOARDING_STEPS,
  ONBOARDING_TOTAL_STEPS,
} from "../lib/steps.config";
import type { OnboardingStepId } from "../lib/steps.config";
import {
  onboardingWizardSchema,
  STEP_SCHEMAS,
  type OnboardingWizardValues,
} from "../schemas";
import { OnboardingShell } from "./onboarding-shell";
import { StepTransition } from "./step-transition";
import {
  CompleteStep,
  GrievingWhoStep,
  LossTimelineStep,
  WelcomeStep,
} from "./steps";

type OnboardingWizardProps = {
  initialAnswers: Partial<OnboardingWizardValues>;
  userName?: string | null;
};

const STEP_FIELD_MAP: Partial<
  Record<OnboardingStepId, keyof OnboardingWizardValues>
> = {
  grieving_who: "grieving_who",
  loss_timeline: "loss_timeline",
};

export function OnboardingWizard({
  initialAnswers,
  userName,
}: OnboardingWizardProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [isPending, startTransition] = useTransition();
  const [saveError, setSaveError] = useState<string | null>(null);

  const currentStep = ONBOARDING_STEPS[stepIndex];

  const form = useForm<OnboardingWizardValues>({
    resolver: zodResolver(onboardingWizardSchema),
    defaultValues: {
      grieving_who: initialAnswers.grieving_who ?? [],
      loss_timeline: initialAnswers.loss_timeline ?? "",
    },
    mode: "onChange",
  });

  const goToStep = (index: number, nextDirection: "forward" | "backward") => {
    setDirection(nextDirection);
    setStepIndex(index);
    setSaveError(null);
  };

  const persistStep = async (stepId: OnboardingStepId) => {
    const fieldKey = STEP_FIELD_MAP[stepId];

    if (!fieldKey) {
      return;
    }

    const value = form.getValues(fieldKey);
    await saveOnboardingStep(fieldKey, value);
  };

  const handleNext = () => {
    const schema = STEP_SCHEMAS[currentStep.id];
    const fieldKey = STEP_FIELD_MAP[currentStep.id];
    const values = fieldKey ? { [fieldKey]: form.getValues(fieldKey) } : {};

    const parsed = schema.safeParse(values);

    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Please complete this step";
      if (fieldKey) {
        form.setError(fieldKey, { message });
      }
      return;
    }

    startTransition(async () => {
      try {
        if (currentStep.saveOnExit) {
          await persistStep(currentStep.id);
        }

        if (stepIndex < ONBOARDING_STEPS.length - 1) {
          goToStep(stepIndex + 1, "forward");
          return;
        }
      } catch (error) {
        setSaveError(
          error instanceof Error ? error.message : "Failed to save your progress",
        );
      }
    });
  };

  const handleBack = () => {
    if (stepIndex > 0) {
      goToStep(stepIndex - 1, "backward");
    }
  };

  const handleComplete = () => {
    startTransition(async () => {
      try {
        await completeOnboarding();
      } catch (error) {
        setSaveError(
          error instanceof Error ? error.message : "Failed to complete onboarding",
        );
      }
    });
  };

  const renderStep = () => {
    switch (currentStep.id) {
      case "welcome":
        return <WelcomeStep userName={userName} />;
      case "grieving_who":
        return (
          <GrievingWhoStep
            control={form.control}
            error={form.formState.errors.grieving_who?.message}
          />
        );
      case "loss_timeline":
        return (
          <LossTimelineStep
            control={form.control}
            error={form.formState.errors.loss_timeline?.message}
          />
        );
      case "complete":
        return <CompleteStep values={form.getValues()} />;
      default:
        return null;
    }
  };

  const isLastStep = currentStep.id === "complete";

  return (
    <OnboardingShell
      currentStep={stepIndex + 1}
      totalSteps={ONBOARDING_TOTAL_STEPS}
      footer={
        <div className="space-y-3">
          {saveError ? (
            <p className="text-sm text-destructive">{saveError}</p>
          ) : null}
          <div className="flex gap-3">
            {stepIndex > 0 && !isLastStep ? (
              <Button
                type="button"
                variant="outline"
                className="h-12 flex-1 border-onboarding-border bg-white text-onboarding-foreground hover:bg-onboarding-surface"
                onClick={handleBack}
                disabled={isPending}
              >
                Back
              </Button>
            ) : null}
            <Button
              type="button"
              className={cn(
                "h-12 bg-onboarding-primary text-white hover:opacity-90",
                stepIndex > 0 && !isLastStep ? "flex-[2]" : "w-full",
              )}
              onClick={isLastStep ? handleComplete : handleNext}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="size-5 animate-spin" />
              ) : isLastStep ? (
                "Continue to assessment"
              ) : (
                "Next"
              )}
            </Button>
          </div>
        </div>
      }
    >
      <StepTransition stepKey={currentStep.id} direction={direction}>
        {renderStep()}
      </StepTransition>
    </OnboardingShell>
  );
}
