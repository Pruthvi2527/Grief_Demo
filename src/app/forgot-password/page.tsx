import type { Metadata } from "next";

import { AuthShell, ForgotPasswordForm } from "@/features/auth/components";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your bonds account password",
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Forgot password"
      description="Enter your email and we'll send you a reset link."
    >
      <div className="rounded-xl border border-onboarding-border bg-white/90 p-6 shadow-sm">
        <ForgotPasswordForm />
      </div>
    </AuthShell>
  );
}
