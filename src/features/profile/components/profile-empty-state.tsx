import { DashboardShell } from "@/features/dashboard/components";

export function ProfileEmptyState() {
  return (
    <DashboardShell activeNav="profile">
      <div className="mx-auto max-w-lg rounded-2xl border border-dashed border-onboarding-border bg-white/70 px-8 py-14 text-center">
        <h2 className="text-xl font-semibold text-onboarding-foreground">
          Profile unavailable
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-onboarding-muted">
          We could not load your profile details right now. Please try again in a
          moment.
        </p>
      </div>
    </DashboardShell>
  );
}
