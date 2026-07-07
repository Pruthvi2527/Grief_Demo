import { DashboardShell } from "./dashboard-shell";

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-onboarding-border/50 ${className ?? ""}`}
    />
  );
}

export function DashboardSkeleton() {
  return (
    <DashboardShell activeNav="tree">
      <div className="space-y-10" aria-busy="true" aria-label="Loading dashboard">
        <div className="space-y-3">
          <SkeletonBlock className="h-4 w-24" />
          <SkeletonBlock className="h-10 w-64" />
          <SkeletonBlock className="h-5 w-full max-w-xl" />
        </div>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
          <SkeletonBlock className="h-96" />
          <SkeletonBlock className="h-72" />
        </div>

        <div className="space-y-3">
          <SkeletonBlock className="h-7 w-48" />
          <SkeletonBlock className="h-24" />
          <SkeletonBlock className="h-24" />
          <SkeletonBlock className="h-24" />
        </div>
      </div>
    </DashboardShell>
  );
}
