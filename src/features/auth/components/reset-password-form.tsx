"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useZodForm } from "@/hooks/use-zod-form";

import { resetPassword } from "../actions";
import { resetPasswordSchema, type ResetPasswordFormValues } from "../schemas";
import { AUTH_ROUTES } from "../lib/routes";
import { AuthErrorAlert } from "./auth-alert";
import { AuthFormField } from "./auth-form-field";

export function ResetPasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useZodForm(resetPasswordSchema, {
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: ResetPasswordFormValues) => {
    setServerError(null);

    startTransition(async () => {
      const result = await resetPassword(values);

      if (result?.error) {
        setServerError(result.error);
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

      <AuthFormField
        label="New password"
        htmlFor="password"
        error={errors.password?.message}
      >
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          className="border-onboarding-border bg-white"
          {...register("password")}
        />
      </AuthFormField>

      <AuthFormField
        label="Confirm new password"
        htmlFor="confirmPassword"
        error={errors.confirmPassword?.message}
      >
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Repeat your password"
          className="border-onboarding-border bg-white"
          {...register("confirmPassword")}
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
          "Update password"
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
