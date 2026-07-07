"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { StepTransition } from "@/features/onboarding/components/step-transition";
import { cn } from "@/lib/utils";

import { completeAssessment, saveAssessmentStep } from "../actions";
import {
  ASSESSMENT_STEPS,
  ASSESSMENT_TOTAL_STEPS,
} from "../lib/questions.config";
import type { AssessmentStepId } from "../lib/questions.config";
import {
  assessmentWizardSchema,
  STEP_SCHEMAS,
  type AssessmentWizardValues,
} from "../schemas";
import { AssessmentShell } from "./assessment-shell";
import {
  CompleteStep,
  CurrentFeelingsQuestion,
  EnergyLevelQuestion,
  GriefWeightQuestion,
  WelcomeStep,
} from "./assessment-steps";

type AssessmentWizardProps = {
  initialAnswers: Partial<AssessmentWizardValues>;
  userName?: string | null;
};

const STEP_FIELD_MAP: Partial<
  Record<AssessmentStepId, keyof AssessmentWizardValues>
> = {
  current_feelings: "current_feelings",
  grief_weight: "grief_weight",
  energy_level: "energy_level",
};

export function AssessmentWizard({
  initialAnswers,
  userName,
}: AssessmentWizardProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [isPending, startTransition] = useTransition();
  const [saveError, setSaveError] = useState<string | null>(null);

  const currentStep = ASSESSMENT_STEPS[stepIndex];

  const form = useForm<AssessmentWizardValues>({
    resolver: zodResolver(assessmentWizardSchema),
    defaultValues: {
      current_feelings: initialAnswers.current_feelings ?? [],
      grief_weight: initialAnswers.grief_weight ?? "",
      energy_level: initialAnswers.energy_level ?? "",
    },
    mode: "onChange",
  });

  const goToStep = (index: number, nextDirection: "forward" | "backward") => {
    setDirection(nextDirection);
    setStepIndex(index);
    setSaveError(null);
  };

  const persistStep = async (stepId: AssessmentStepId) => {
    const fieldKey = STEP_FIELD_MAP[stepId];

    if (!fieldKey) {
      return;
    }

    const value = form.getValues(fieldKey);
    await saveAssessmentStep(fieldKey, value);
  };

  const handleNext = () => {
    const schema = STEP_SCHEMAS[currentStep.id];
    const fieldKey = STEP_FIELD_MAP[currentStep.id];
    const values = fieldKey ? { [fieldKey]: form.getValues(fieldKey) } : {};

    const parsed = schema.safeParse(values);

    if (!parsed.success) {
      const message =
        parsed.error.issues[0]?.message ?? "Please complete this question";

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

        if (stepIndex < ASSESSMENT_STEPS.length - 1) {
          goToStep(stepIndex + 1, "forward");
        }
      } catch (error) {
        setSaveError(
          error instanceof Error
            ? error.message
            : "Failed to save your response",
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
        await completeAssessment();
      } catch (error) {
        setSaveError(
          error instanceof Error
            ? error.message
            : "Failed to complete assessment",
        );
      }
    });
  };

  const renderStep = () => {
    switch (currentStep.id) {
      case "welcome":
        return <WelcomeStep userName={userName} />;
      case "current_feelings":
        return (
          <CurrentFeelingsQuestion
            control={form.control}
            error={form.formState.errors.current_feelings?.message}
          />
        );
      case "grief_weight":
        return (
          <GriefWeightQuestion
            control={form.control}
            error={form.formState.errors.grief_weight?.message}
          />
        );
      case "energy_level":
        return (
          <EnergyLevelQuestion
            control={form.control}
            error={form.formState.errors.energy_level?.message}
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
    <AssessmentShell
      currentStep={stepIndex + 1}
      totalSteps={ASSESSMENT_TOTAL_STEPS}
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
                "Go to My Tree"
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
    </AssessmentShell>
  );
}
