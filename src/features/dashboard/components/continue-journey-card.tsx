import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { ContinueJourney } from "../types";

type ContinueJourneyCardProps = {
  continueJourney: ContinueJourney;
};

function formatDuration(durationMin: number | null): string | null {
  if (!durationMin) {
    return null;
  }

  return `${durationMin} min`;
}

export function ContinueJourneyCard({ continueJourney }: ContinueJourneyCardProps) {
  if (!continueJourney) {
    return (
      <Card className="border-onboarding-border bg-onboarding-surface/60 shadow-none">
        <CardHeader>
          <CardTitle className="text-xl text-onboarding-foreground">
            Journey complete
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-onboarding-muted">
            You have finished every exercise in your course. Take a moment to
            celebrate how far you have come.
          </p>
        </CardContent>
      </Card>
    );
  }

  const durationLabel = formatDuration(continueJourney.durationMin);
  const statusLabel =
    continueJourney.status === "in_progress" ? "Continue" : "Start";

  return (
    <Card className="border-onboarding-border bg-white shadow-sm">
      <CardHeader className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-onboarding-muted">
          Continue journey
        </p>
        <CardTitle className="text-2xl text-onboarding-foreground">
          {continueJourney.exerciseTitle}
        </CardTitle>
        <p className="text-sm text-onboarding-muted">
          {continueJourney.sectionTitle}
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        {durationLabel ? (
          <p className="inline-flex items-center gap-2 text-sm text-onboarding-muted">
            <Clock3 className="size-4" aria-hidden="true" />
            {durationLabel}
          </p>
        ) : null}

        <Link
          href={`/exercises/${continueJourney.exerciseId}`}
          className={buttonVariants({
            className:
              "h-11 w-full bg-onboarding-primary text-white hover:bg-onboarding-primary/90 sm:w-auto",
          })}
        >
          {statusLabel}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </CardContent>
    </Card>
  );
}
