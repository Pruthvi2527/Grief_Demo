"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

import { AUTH_ROUTES } from "../lib/routes";
import { AuthService } from "../services/auth.service";

export async function signInWithGoogle() {
  try {
    const authService = await AuthService.create();
    const result = await authService.signInWithGoogle();

    if (!result.success) {
      redirect(
        `${AUTH_ROUTES.login}?error=${encodeURIComponent(result.error)}`,
      );
    }

    if (result.url) {
      redirect(result.url);
    }

    redirect(`${AUTH_ROUTES.login}?error=oauth_url_missing`);
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    redirect(`${AUTH_ROUTES.login}?error=oauth_start_failed`);
  }
}
