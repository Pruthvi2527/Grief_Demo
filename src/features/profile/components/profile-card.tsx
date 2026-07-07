import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type ProfileCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function ProfileCard({
  title,
  description,
  children,
  className,
}: ProfileCardProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-onboarding-border bg-white/80 p-6 sm:p-8",
        className,
      )}
    >
      <header className="mb-6 space-y-1">
        <h2 className="text-lg font-semibold text-onboarding-foreground">{title}</h2>
        {description ? (
          <p className="text-sm text-onboarding-muted">{description}</p>
        ) : null}
      </header>
      {children}
    </section>
  );
}

type ProfileInfoRowProps = {
  label: string;
  value: string;
};

export function ProfileInfoRow({ label, value }: ProfileInfoRowProps) {
  return (
    <div className="flex flex-col gap-1 border-b border-onboarding-border/60 py-4 last:border-b-0 last:pb-0 first:pt-0">
      <p className="text-xs font-semibold uppercase tracking-wide text-onboarding-muted">
        {label}
      </p>
      <p className="text-base text-onboarding-foreground">{value}</p>
    </div>
  );
}
