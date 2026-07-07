import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/types/database";

import { getSupabaseKeys } from "./config";

let browserClient: ReturnType<typeof createBrowserClient<Database>> | undefined;

/**
 * Browser Supabase client for Client Components.
 * Uses a module singleton to avoid multiple GoTrue instances.
 *
 * @see https://supabase.com/docs/guides/auth/server-side/nextjs
 */
export function createClient() {
  if (!browserClient) {
    const { url, anonKey } = getSupabaseKeys();
    browserClient = createBrowserClient<Database>(url, anonKey);
  }

  return browserClient;
}
