import { NextResponse } from "next/server";

import { AuthService } from "@/features/auth/services/auth.service";
import { AUTH_ROUTES } from "@/features/auth/lib/routes";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (!code) {
    return NextResponse.redirect(
      `${origin}${AUTH_ROUTES.login}?error=auth_code_missing`,
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      `${origin}${AUTH_ROUTES.login}?error=${encodeURIComponent(error.message)}`,
    );
  }

  if (next && next.startsWith("/")) {
    return NextResponse.redirect(`${origin}${next}`);
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.redirect(
      `${origin}${AUTH_ROUTES.login}?error=auth_user_missing`,
    );
  }

  try {
    const authService = await AuthService.create();
    const result = await authService.handleAuthCallback(user);

    if (!result.success || !("redirectTo" in result)) {
      return NextResponse.redirect(
        `${origin}${AUTH_ROUTES.login}?error=profile_setup_failed`,
      );
    }

    return NextResponse.redirect(`${origin}${result.redirectTo}`);
  } catch (profileError) {
    const message =
      profileError instanceof Error
        ? profileError.message
        : "profile_setup_failed";

    return NextResponse.redirect(
      `${origin}${AUTH_ROUTES.login}?error=${encodeURIComponent(message)}`,
    );
  }
}
