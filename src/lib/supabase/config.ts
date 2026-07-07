import { getClientEnv } from "@/lib/env";

export type SupabaseKeys = {
  url: string;
  anonKey: string;
};

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export function getSupabaseKeys(): SupabaseKeys {
  const env = getClientEnv();

  return {
    url: env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };
}

/**
 * Middleware matcher — excludes static assets and image optimization routes.
 * @see https://supabase.com/docs/guides/auth/server-side/nextjs
 */
export const SUPABASE_MIDDLEWARE_MATCHER =
  "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)";
