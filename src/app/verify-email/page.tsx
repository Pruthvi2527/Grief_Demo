import type { Metadata } from "next";

import { AuthShell, VerifyEmailForm } from "@/features/auth/components";

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Verify your bonds account email",
};

type VerifyEmailPageProps = {
  searchParams: Promise<{
    email?: string;
  }>;
};

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const params = await searchParams;

  return (
    <AuthShell
      title="Verify your email"
      description="We sent a verification link to your inbox. Click the link to activate your account, then sign in."
    >
      <div className="rounded-xl border border-onboarding-border bg-white/90 p-6 shadow-sm">
        <VerifyEmailForm email={params.email} />
      </div>
    </AuthShell>
  );
}
