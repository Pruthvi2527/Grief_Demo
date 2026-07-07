import { DashboardShell } from "@/features/dashboard/components";

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-onboarding-border/50 ${className ?? ""}`}
    />
  );
}

export function ProfileSkeleton() {
  return (
    <DashboardShell activeNav="profile">
      <div className="space-y-10" aria-busy="true" aria-label="Loading profile">
        <div className="space-y-3">
          <SkeletonBlock className="h-4 w-24" />
          <SkeletonBlock className="h-10 w-56" />
          <SkeletonBlock className="h-5 w-full max-w-xl" />
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <SkeletonBlock className="h-56" />
          <SkeletonBlock className="h-56" />
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <SkeletonBlock className="h-80" />
          <SkeletonBlock className="h-80" />
        </div>
      </div>
    </DashboardShell>
  );
}
