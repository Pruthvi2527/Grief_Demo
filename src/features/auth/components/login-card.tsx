import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { AuthDivider } from "./auth-divider";
import { AuthErrorAlert } from "./auth-alert";
import { GoogleSignInButton } from "./google-sign-in-button";
import { LoginForm } from "./login-form";

type LoginCardProps = {
  error?: string | null;
  message?: string | null;
};

export function LoginCard({ error, message }: LoginCardProps) {
  return (
    <Card className="w-full max-w-md border-onboarding-border bg-white/90 shadow-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-onboarding-foreground">Welcome back</CardTitle>
        <CardDescription className="text-onboarding-muted">
          Sign in to continue your grief journey.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <AuthErrorAlert message={error} />
        {message ? (
          <p className="rounded-md border border-onboarding-primary/20 bg-onboarding-primary/10 px-3 py-2 text-sm text-onboarding-primary">
            {message}
          </p>
        ) : null}
        <LoginForm />
        <AuthDivider />
        <GoogleSignInButton />
      </CardContent>
    </Card>
  );
}
