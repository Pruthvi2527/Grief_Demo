"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useZodForm } from "@/hooks/use-zod-form";

import { resendVerificationEmail } from "../actions";
import {
  resendVerificationSchema,
  type ResendVerificationFormValues,
} from "../schemas";
import { AUTH_ROUTES } from "../lib/routes";
import { AuthErrorAlert, AuthSuccessAlert } from "./auth-alert";
import { AuthFormField } from "./auth-form-field";

type VerifyEmailFormProps = {
  email?: string;
};

export function VerifyEmailForm({ email = "" }: VerifyEmailFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useZodForm(resendVerificationSchema, {
    defaultValues: { email },
  });

  const onSubmit = (values: ResendVerificationFormValues) => {
    setServerError(null);
    setSuccessMessage(null);

    startTransition(async () => {
      const result = await resendVerificationEmail(values);

      if (result?.error) {
        setServerError(result.error);
        return;
      }

      if (result?.message) {
        setSuccessMessage(result.message);
      }
    });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <AuthErrorAlert message={serverError} />
      <AuthSuccessAlert message={successMessage} />

      <AuthFormField label="Email" htmlFor="email" error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className="border-onboarding-border bg-white"
          {...register("email")}
        />
      </AuthFormField>

      <Button
        type="submit"
        className="h-11 w-full bg-onboarding-primary text-white hover:opacity-90"
        disabled={isPending}
      >
        {isPending ? (
          <Loader2 className="size-5 animate-spin" />
        ) : (
          "Resend verification email"
        )}
      </Button>

      <p className="text-center text-sm text-onboarding-muted">
        <Link
          href={AUTH_ROUTES.login}
          className="font-medium text-onboarding-primary hover:underline"
        >
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
