import { type NextRequest, NextResponse } from "next/server";

import { handleAuthMiddleware } from "@/features/auth/lib/middleware";
import { isSupabaseConfigured } from "@/lib/supabase";

export async function middleware(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.next();
  }

  return handleAuthMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
