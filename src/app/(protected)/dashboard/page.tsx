import { redirect } from "next/navigation";
import type { Metadata } from "next";

import {
  DashboardEmpty,
  DashboardView,
} from "@/features/dashboard/components";
import { loadDashboardPageData } from "@/features/dashboard/lib/load-dashboard-page";

export const metadata: Metadata = {
  title: "My Tree",
  description: "Your personalized grief course dashboard",
};

export default async function DashboardPage() {
  const result = await loadDashboardPageData();

  if (result.status === "unauthenticated") {
    redirect("/login");
  }

  if (result.status === "needs_onboarding") {
    redirect("/onboarding");
  }

  if (result.status === "needs_assessment") {
    redirect("/assessment");
  }

  if (result.status === "empty") {
    return <DashboardEmpty userName={result.userName} />;
  }

  return <DashboardView data={result.dashboard} />;
}
