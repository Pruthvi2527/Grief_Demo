"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

type SignOutOptions = {
  redirectTo?: string;
  revalidatePaths?: string[];
};

/**
 * Signs out the current user and redirects.
 */
export async function signOut(options: SignOutOptions = {}) {
  const { redirectTo = "/", revalidatePaths = [] } = options;
  const supabase = await createClient();

  await supabase.auth.signOut();

  for (const path of revalidatePaths) {
    revalidatePath(path);
  }

  redirect(redirectTo);
}

type ExchangeCodeOptions = {
  redirectTo?: string;
  revalidatePaths?: string[];
};

/**
 * Exchanges an OAuth or email confirmation code for a session.
 * Use in auth callback Route Handlers.
 */
export async function exchangeCodeForSession(
  code: string,
  options: ExchangeCodeOptions = {},
) {
  const { redirectTo = "/", revalidatePaths = [] } = options;
  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return { error: error.message };
  }

  for (const path of revalidatePaths) {
    revalidatePath(path);
  }

  if (redirectTo) {
    redirect(redirectTo);
  }

  return { error: null };
}
