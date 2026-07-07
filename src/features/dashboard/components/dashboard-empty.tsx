import { Sprout } from "lucide-react";

import { DashboardShell } from "./dashboard-shell";
import { UserGreeting } from "./user-greeting";

type DashboardEmptyProps = {
  userName: string | null;
};

export function DashboardEmpty({ userName }: DashboardEmptyProps) {
  return (
    <DashboardShell activeNav="tree">
      <div className="space-y-10">
        <UserGreeting name={userName} />

        <div className="mx-auto flex max-w-lg flex-col items-center rounded-2xl border border-dashed border-onboarding-border bg-white/70 px-8 py-14 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-onboarding-surface">
            <Sprout className="size-8 text-onboarding-primary" aria-hidden="true" />
          </div>
          <h2 className="mt-6 text-xl font-semibold text-onboarding-foreground">
            Your course is being prepared
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-onboarding-muted">
            We could not find any sections or exercises yet. Once course content
            is added to Supabase, your personalized dashboard will appear here.
          </p>
        </div>
      </div>
    </DashboardShell>
  );
}
