import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthShell, ResetPasswordForm } from "@/features/auth/components";
import { AUTH_ROUTES } from "@/features/auth/lib/routes";
import { getUser } from "@/lib/supabase/auth";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Set a new password for your bonds account",
};

export default async function ResetPasswordPage() {
  const user = await getUser();

  if (!user) {
    redirect(AUTH_ROUTES.forgotPassword);
  }

  return (
    <AuthShell
      title="Reset password"
      description="Choose a new password for your account."
    >
      <div className="rounded-xl border border-onboarding-border bg-white/90 p-6 shadow-sm">
        <ResetPasswordForm />
      </div>
    </AuthShell>
  );
}
