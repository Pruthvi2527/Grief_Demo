export const AUTH_ROUTES = {
  login: "/login",
  signup: "/signup",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  verifyEmail: "/verify-email",
  callback: "/auth/callback",
  onboarding: "/onboarding",
  assessment: "/assessment",
  dashboard: "/dashboard",
  profile: "/profile",
  home: "/",
} as const;

export const PUBLIC_AUTH_PATHS = [
  AUTH_ROUTES.login,
  AUTH_ROUTES.signup,
  AUTH_ROUTES.forgotPassword,
  AUTH_ROUTES.resetPassword,
  AUTH_ROUTES.verifyEmail,
  AUTH_ROUTES.callback,
] as const;

export const PROTECTED_PATHS = [
  AUTH_ROUTES.onboarding,
  AUTH_ROUTES.assessment,
  AUTH_ROUTES.dashboard,
  AUTH_ROUTES.profile,
  "/exercises",
] as const;

export const AUTHENTICATED_REDIRECT_PATH = AUTH_ROUTES.dashboard;
export const UNAUTHENTICATED_REDIRECT_PATH = AUTH_ROUTES.login;

function matchesPath(pathname: string, path: string) {
  return pathname === path || pathname.startsWith(`${path}/`);
}

export function isPublicAuthPath(pathname: string) {
  return PUBLIC_AUTH_PATHS.some((path) => matchesPath(pathname, path));
}

export function isProtectedPath(pathname: string) {
  return PROTECTED_PATHS.some((path) => matchesPath(pathname, path));
}

export function isAuthenticatedEntryPath(pathname: string) {
  return (
    pathname === AUTH_ROUTES.home ||
    pathname === AUTH_ROUTES.login ||
    pathname === AUTH_ROUTES.signup
  );
}
