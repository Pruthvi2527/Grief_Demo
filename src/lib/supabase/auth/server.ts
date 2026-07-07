import { redirect } from "next/navigation";
import { cache } from "react";

import { createClient } from "@/lib/supabase/server";

/**
 * Returns the authenticated user validated against the Supabase Auth server.
 * Prefer this over `getSession()` for authorization decisions.
 */
export const getUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    return null;
  }

  return user;
});

/**
 * Returns verified JWT claims without a round-trip to the Auth server when possible.
 */
export const getClaims = cache(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error) {
    return null;
  }

  return data?.claims ?? null;
});

/**
 * Returns the authenticated user or redirects to the given path.
 */
export async function requireUser(redirectTo = "/login") {
  const user = await getUser();

  if (!user) {
    redirect(redirectTo);
  }

  return user;
}

/**
 * Returns true when a validated user session exists.
 */
export async function isAuthenticated() {
  const user = await getUser();
  return user !== null;
}
