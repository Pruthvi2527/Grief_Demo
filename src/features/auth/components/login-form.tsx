"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useZodForm } from "@/hooks/use-zod-form";

import { signInWithEmail } from "../actions";
import { loginSchema, type LoginFormValues } from "../schemas";
import { AUTH_ROUTES } from "../lib/routes";
import { AuthErrorAlert } from "./auth-alert";
import { AuthFormField } from "./auth-form-field";

export function LoginForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useZodForm(loginSchema, {
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    setServerError(null);

    startTransition(async () => {
      const result = await signInWithEmail(values);

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
          autoComplete="current-password"
          placeholder="••••••••"
          className="border-onboarding-border bg-white"
          {...register("password")}
        />
      </AuthFormField>

      <div className="flex justify-end">
        <Link
          href={AUTH_ROUTES.forgotPassword}
          className="text-sm text-onboarding-primary hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        className="h-11 w-full bg-onboarding-primary text-white hover:opacity-90"
        disabled={isPending}
      >
        {isPending ? <Loader2 className="size-5 animate-spin" /> : "Sign in"}
      </Button>

      <p className="text-center text-sm text-onboarding-muted">
        Don&apos;t have an account?{" "}
        <Link
          href={AUTH_ROUTES.signup}
          className="font-medium text-onboarding-primary hover:underline"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}
