"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { AUTH_ROUTES } from "../lib/routes";
import { AuthService } from "../services/auth.service";

export async function signOutUser() {
  const authService = await AuthService.create();
  await authService.signOut();

  revalidatePath(AUTH_ROUTES.home);
  revalidatePath(AUTH_ROUTES.login);
  revalidatePath(AUTH_ROUTES.onboarding);
  revalidatePath(AUTH_ROUTES.dashboard);
  revalidatePath(AUTH_ROUTES.profile);

  redirect(AUTH_ROUTES.login);
}
