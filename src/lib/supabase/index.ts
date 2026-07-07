export { createClient as createBrowserClient } from "./client";
export {
  exchangeCodeForSession,
  getClaims,
  getUser,
  isAuthenticated,
  requireUser,
  signOut,
} from "./auth";
export {
  getSupabaseKeys,
  isSupabaseConfigured,
  SUPABASE_MIDDLEWARE_MATCHER,
} from "./config";
export type { SupabaseKeys } from "./config";
export { createSupabaseServerClient } from "./create-server-client";
export { updateSession } from "./middleware";
export { createClient as createServerClient } from "./server";
