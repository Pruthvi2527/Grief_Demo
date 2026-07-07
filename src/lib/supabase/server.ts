import { cookies } from "next/headers";

import { createSupabaseServerClient } from "./create-server-client";

/**
 * Server Supabase client for Server Components, Server Actions, and Route Handlers.
 *
 * Cookie writes may fail in Server Components — middleware refreshes sessions instead.
 *
 * @see https://supabase.com/docs/guides/auth/server-side/nextjs
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createSupabaseServerClient({
    getAll() {
      return cookieStore.getAll();
    },
    setAll(cookiesToSet) {
      try {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      } catch {
        // Called from a Server Component — safe to ignore when middleware refreshes sessions.
      }
    },
  });
}
