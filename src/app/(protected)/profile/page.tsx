import type { Metadata } from "next";
import { redirect } from "next/navigation";

import {
  ProfileEmptyState,
  ProfilePageView,
} from "@/features/profile/components";
import { loadProfilePageData } from "@/features/profile/lib/load-profile-page";

export const metadata: Metadata = {
  title: "My Profile",
  description: "Manage your personal information and healing journey",
};

export default async function ProfilePage() {
  const result = await loadProfilePageData();

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
    return <ProfileEmptyState />;
  }

  return <ProfilePageView data={result.data} />;
}
