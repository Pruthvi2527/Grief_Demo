import {
  createServerClient,
  type CookieMethodsServer,
} from "@supabase/ssr";

import type { Database } from "@/types/database";

import { getSupabaseKeys } from "./config";

export function createSupabaseServerClient(cookies: CookieMethodsServer) {
  const { url, anonKey } = getSupabaseKeys();

  return createServerClient<Database>(url, anonKey, { cookies });
}
