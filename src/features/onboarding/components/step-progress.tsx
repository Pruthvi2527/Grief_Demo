import { cn } from "@/lib/utils";

type StepProgressProps = {
  currentStep: number;
  totalSteps: number;
};

export function StepProgress({ currentStep, totalSteps }: StepProgressProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-onboarding-muted">
        Step {currentStep} of {totalSteps}
      </p>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-onboarding-border">
        <div
          className="h-full rounded-full bg-onboarding-primary transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

type StepHeaderProps = {
  title: string;
  description?: string;
  instruction?: string;
  className?: string;
};

export function StepHeader({
  title,
  description,
  instruction,
  className,
}: StepHeaderProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <h2 className="text-3xl font-semibold tracking-tight text-onboarding-foreground">
        {title}
      </h2>
      {instruction ? (
        <p className="text-sm text-onboarding-muted">{instruction}</p>
      ) : null}
      {description ? (
        <p className="text-base leading-relaxed text-onboarding-muted">
          {description}
        </p>
      ) : null}
    </div>
  );
}
