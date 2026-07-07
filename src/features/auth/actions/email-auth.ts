"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

import type {
  ForgotPasswordFormValues,
  LoginFormValues,
  ResendVerificationFormValues,
  ResetPasswordFormValues,
  SignupFormValues,
} from "../schemas";
import {
  forgotPasswordSchema,
  loginSchema,
  resendVerificationSchema,
  resetPasswordSchema,
  signupSchema,
} from "../schemas";
import { AuthService } from "../services/auth.service";
import { AUTH_ROUTES } from "../lib/routes";

function formatZodError(error: { issues: { message: string }[] }) {
  return error.issues[0]?.message ?? "Invalid form data";
}

export async function signUpWithEmail(values: SignupFormValues) {
  const parsed = signupSchema.safeParse(values);

  if (!parsed.success) {
    return { error: formatZodError(parsed.error) };
  }

  try {
    const authService = await AuthService.create();
    const result = await authService.signUpWithEmail({
      email: parsed.data.email,
      password: parsed.data.password,
      fullName: parsed.data.fullName,
    });

    if (!result.success) {
      return { error: result.error };
    }

    if ("needsVerification" in result && result.needsVerification) {
      redirect(
        `${AUTH_ROUTES.verifyEmail}?email=${encodeURIComponent(result.email)}`,
      );
    }

    if ("redirectTo" in result) {
      redirect(result.redirectTo);
    }
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return {
      error:
        error instanceof Error ? error.message : "Sign up failed. Please try again.",
    };
  }
}

export async function signInWithEmail(values: LoginFormValues) {
  const parsed = loginSchema.safeParse(values);

  if (!parsed.success) {
    return { error: formatZodError(parsed.error) };
  }

  try {
    const authService = await AuthService.create();
    const result = await authService.signInWithEmail(parsed.data);

    if (!result.success) {
      return { error: result.error };
    }

    if ("needsVerification" in result && result.needsVerification) {
      redirect(
        `${AUTH_ROUTES.verifyEmail}?email=${encodeURIComponent(result.email)}`,
      );
    }

    if ("redirectTo" in result) {
      redirect(result.redirectTo);
    }
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return {
      error:
        error instanceof Error ? error.message : "Sign in failed. Please try again.",
    };
  }
}

export async function requestPasswordReset(values: ForgotPasswordFormValues) {
  const parsed = forgotPasswordSchema.safeParse(values);

  if (!parsed.success) {
    return { error: formatZodError(parsed.error) };
  }

  const authService = await AuthService.create();
  const result = await authService.forgotPassword(parsed.data);

  if (!result.success) {
    return { error: result.error };
  }

  if ("message" in result) {
    return { message: result.message };
  }

  return { error: "Could not send reset link." };
}

export async function resetPassword(values: ResetPasswordFormValues) {
  const parsed = resetPasswordSchema.safeParse(values);

  if (!parsed.success) {
    return { error: formatZodError(parsed.error) };
  }

  try {
    const authService = await AuthService.create();
    const result = await authService.resetPassword({
      password: parsed.data.password,
    });

    if (!result.success) {
      return { error: result.error };
    }

    if ("redirectTo" in result) {
      redirect(`${result.redirectTo}?message=password_reset_success`);
    }
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return {
      error:
        error instanceof Error
          ? error.message
          : "Password reset failed. Please try again.",
    };
  }
}

export async function resendVerificationEmail(
  values: ResendVerificationFormValues,
) {
  const parsed = resendVerificationSchema.safeParse(values);

  if (!parsed.success) {
    return { error: formatZodError(parsed.error) };
  }

  const authService = await AuthService.create();
  const result = await authService.resendVerificationEmail(parsed.data.email);

  if (!result.success) {
    return { error: result.error };
  }

  if ("message" in result) {
    return { message: result.message };
  }

  return { error: "Could not resend verification email." };
}
