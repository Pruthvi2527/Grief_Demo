import { type NextRequest, NextResponse } from "next/server";

import { updateSession } from "@/lib/supabase/middleware";

import {
  AUTHENTICATED_REDIRECT_PATH,
  AUTH_ROUTES,
  isAuthenticatedEntryPath,
  isProtectedPath,
  isPublicAuthPath,
  UNAUTHENTICATED_REDIRECT_PATH,
} from "./routes";

function copySessionResponse(
  source: NextResponse,
  target: NextResponse,
) {
  source.cookies.getAll().forEach(({ name, value }) => {
    target.cookies.set(name, value);
  });

  source.headers.forEach((value, key) => {
    target.headers.set(key, value);
  });
}

function redirectWithSession(
  request: NextRequest,
  pathname: string,
  sessionResponse: NextResponse,
  searchParams?: Record<string, string>,
) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;

  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  const redirectResponse = NextResponse.redirect(url);
  copySessionResponse(sessionResponse, redirectResponse);
  return redirectResponse;
}

export async function handleAuthMiddleware(request: NextRequest) {
  const { response: sessionResponse, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  if (isPublicAuthPath(pathname)) {
    const allowAuthenticatedAccess =
      pathname === AUTH_ROUTES.callback ||
      pathname === AUTH_ROUTES.resetPassword;

    if (user && !allowAuthenticatedAccess) {
      return redirectWithSession(
        request,
        AUTHENTICATED_REDIRECT_PATH,
        sessionResponse,
      );
    }

    return sessionResponse;
  }

  if (user && isAuthenticatedEntryPath(pathname)) {
    return redirectWithSession(
      request,
      AUTHENTICATED_REDIRECT_PATH,
      sessionResponse,
    );
  }

  if (!user && (isProtectedPath(pathname) || pathname === AUTH_ROUTES.home)) {
    const searchParams =
      isProtectedPath(pathname) && pathname !== AUTH_ROUTES.home
        ? { next: pathname }
        : undefined;

    return redirectWithSession(
      request,
      UNAUTHENTICATED_REDIRECT_PATH,
      sessionResponse,
      searchParams,
    );
  }

  return sessionResponse;
}
