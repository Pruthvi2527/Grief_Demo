"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useZodForm } from "@/hooks/use-zod-form";

import { signUpWithEmail } from "../actions";
import { signupSchema, type SignupFormValues } from "../schemas";
import { AUTH_ROUTES } from "../lib/routes";
import { AuthErrorAlert } from "./auth-alert";
import { AuthFormField } from "./auth-form-field";

export function SignupForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useZodForm(signupSchema, {
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: SignupFormValues) => {
    setServerError(null);

    startTransition(async () => {
      const result = await signUpWithEmail(values);

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
        label="Full name"
        htmlFor="fullName"
        error={errors.fullName?.message}
      >
        <Input
          id="fullName"
          type="text"
          autoComplete="name"
          placeholder="Your name"
          className="border-onboarding-border bg-white"
          {...register("fullName")}
        />
      </AuthFormField>

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

      <AuthFormField
        label="Password"
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
        label="Confirm password"
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
        {isPending ? <Loader2 className="size-5 animate-spin" /> : "Create account"}
      </Button>

      <p className="text-center text-sm text-onboarding-muted">
        Already have an account?{" "}
        <Link
          href={AUTH_ROUTES.login}
          className="font-medium text-onboarding-primary hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
