import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { AuthDivider } from "./auth-divider";
import { GoogleSignInButton } from "./google-sign-in-button";
import { SignupForm } from "./signup-form";

export function SignupCard() {
  return (
    <Card className="w-full max-w-md border-onboarding-border bg-white/90 shadow-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-onboarding-foreground">Create your account</CardTitle>
        <CardDescription className="text-onboarding-muted">
          Start your personalized grief journey with bonds.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <SignupForm />
        <AuthDivider />
        <GoogleSignInButton label="Continue with Google" />
      </CardContent>
    </Card>
  );
}
