"use client";

import { StepHeader } from "../step-progress";

type WelcomeStepProps = {
  userName?: string | null;
};

export function WelcomeStep({ userName }: WelcomeStepProps) {
  return (
    <StepHeader
      title={userName ? `Welcome, ${userName.split(" ")[0]}` : "Welcome to bonds"}
      description="We'll ask a few gentle questions to personalize your grief journey. You can take your time — your progress is saved automatically."
    />
  );
}
