import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type QuestionCardProps = {
  title: string;
  instruction?: string;
  description?: string;
  error?: string;
  children: ReactNode;
  className?: string;
};

export function QuestionCard({
  title,
  instruction,
  description,
  error,
  children,
  className,
}: QuestionCardProps) {
  return (
    <div className={cn("space-y-8", className)}>
      <div className="space-y-3">
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

      {children}

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
