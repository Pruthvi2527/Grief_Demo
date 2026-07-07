import type { ReactNode } from "react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { StepProgress } from "@/features/onboarding/components/step-progress";

type AssessmentShellProps = {
  currentStep: number;
  totalSteps: number;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
};

export function AssessmentShell({
  currentStep,
  totalSteps,
  children,
  footer,
  className,
}: AssessmentShellProps) {
  return (
    <div className="min-h-screen bg-onboarding-background">
      <div className="mx-auto grid min-h-screen max-w-6xl lg:grid-cols-[1.1fr_0.9fr]">
        <aside className="relative hidden overflow-hidden lg:block">
          <div className="absolute inset-0 bg-gradient-to-br from-[#e8ede3] via-[#edf2e8] to-[#f6f1e8]" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#d7e2d2] to-transparent" />
          <div className="relative flex h-full flex-col justify-between p-12">
            <p className="text-2xl font-semibold text-onboarding-primary">bonds</p>
            <div className="space-y-4">
              <div className="mx-auto h-52 w-52 rounded-full bg-[radial-gradient(circle_at_35%_35%,#f8efe2,transparent_55%),radial-gradient(circle_at_65%_65%,#c5d4bc,transparent_50%)] opacity-90" />
              <p className="max-w-sm text-lg leading-relaxed text-onboarding-primary/80">
                Understanding your emotions helps us guide you with care.
              </p>
            </div>
          </div>
        </aside>

        <main
          className={cn(
            "flex min-h-screen flex-col px-6 py-8 sm:px-10 lg:px-14 lg:py-12",
            className,
          )}
        >
          <div className="mb-10 space-y-8">
            <p className="text-center text-2xl font-semibold text-onboarding-primary lg:text-left">
              bonds
            </p>
            <StepProgress currentStep={currentStep} totalSteps={totalSteps} />
          </div>

          <div className="flex flex-1 flex-col">{children}</div>

          {footer ? (
            <div className="sticky bottom-0 mt-10 border-t border-onboarding-border/60 bg-onboarding-background/95 pb-2 pt-6 backdrop-blur">
              {footer}
            </div>
          ) : null}
        </main>
      </div>
      <span className="sr-only">{siteConfig.name} emotional assessment</span>
    </div>
  );
}
