"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useZodForm } from "@/hooks/use-zod-form";

import { requestPasswordReset } from "../actions";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "../schemas";
import { AUTH_ROUTES } from "../lib/routes";
import { AuthErrorAlert, AuthSuccessAlert } from "./auth-alert";
import { AuthFormField } from "./auth-form-field";

export function ForgotPasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useZodForm(forgotPasswordSchema, {
    defaultValues: { email: "" },
  });

  const onSubmit = (values: ForgotPasswordFormValues) => {
    setServerError(null);
    setSuccessMessage(null);

    startTransition(async () => {
      const result = await requestPasswordReset(values);

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
          "Send reset link"
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
