import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export default function ExerciseNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-onboarding-background p-6">
      <div className="max-w-md space-y-4 text-center">
        <h1 className="text-xl font-semibold text-onboarding-foreground">
          Exercise not found
        </h1>
        <p className="text-sm text-onboarding-muted">
          This exercise may not exist yet, or it is locked until you complete
          earlier sections.
        </p>
        <Link href="/dashboard" className={buttonVariants()}>
          Back to My Tree
        </Link>
      </div>
    </main>
  );
}
