import { type NextRequest, NextResponse } from "next/server";

import { createSupabaseServerClient } from "./create-server-client";

/**
 * Refreshes the Supabase auth session and syncs cookies on the response.
 *
 * Must be called from root middleware. Do not add logic between
 * `createSupabaseServerClient` and `supabase.auth.getUser()`.
 *
 * @see https://supabase.com/docs/guides/auth/server-side/nextjs
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createSupabaseServerClient({
    getAll() {
      return request.cookies.getAll();
    },
    setAll(cookiesToSet, headers) {
      cookiesToSet.forEach(({ name, value }) => {
        request.cookies.set(name, value);
      });

      supabaseResponse = NextResponse.next({ request });

      cookiesToSet.forEach(({ name, value, options }) => {
        supabaseResponse.cookies.set(name, value, options);
      });

      Object.entries(headers).forEach(([key, value]) => {
        supabaseResponse.headers.set(key, value);
      });
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { response: supabaseResponse, user };
}
