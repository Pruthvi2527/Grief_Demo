import type { User } from "@supabase/supabase-js";

import { getPostAuthRedirectPath } from "@/features/profile/lib/redirects";
import { ProfileService } from "@/features/profile/services/profile.service";
import { createClient } from "@/lib/supabase/server";

import { AUTH_ROUTES } from "../lib/routes";
import { getAppUrl, getCallbackUrl } from "../lib/url";
import type {
  AuthResult,
  ForgotPasswordInput,
  ResetPasswordInput,
  SignInInput,
  SignUpInput,
} from "../types";

export class AuthService {
  constructor(
    private readonly supabase: Awaited<ReturnType<typeof createClient>>,
    private readonly profileService: ProfileService,
  ) {}

  static async create() {
    const supabase = await createClient();
    const profileService = new ProfileService(supabase);
    return new AuthService(supabase, profileService);
  }

  async signUpWithEmail(input: SignUpInput): Promise<AuthResult> {
    const appUrl = await getAppUrl();
    const emailRedirectTo = getCallbackUrl(appUrl, AUTH_ROUTES.callback);

    const { data, error } = await this.supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        emailRedirectTo,
        data: {
          full_name: input.fullName,
        },
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data.user) {
      return { success: false, error: "Sign up failed. Please try again." };
    }

    if (data.session) {
      const profile = await this.profileService.ensureProfile(data.user);
      return {
        success: true,
        redirectTo: getPostAuthRedirectPath(profile),
      };
    }

    return {
      success: true,
      needsVerification: true,
      email: input.email,
    };
  }

  async signInWithEmail(input: SignInInput): Promise<AuthResult> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data.user) {
      return { success: false, error: "Sign in failed. Please try again." };
    }

    if (!this.isEmailVerified(data.user)) {
      return {
        success: true,
        needsVerification: true,
        email: input.email,
      };
    }

    const profile = await this.profileService.ensureProfile(data.user);

    return {
      success: true,
      redirectTo: getPostAuthRedirectPath(profile),
    };
  }

  async signInWithGoogle(): Promise<AuthResult & { url?: string }> {
    const appUrl = await getAppUrl();
    const redirectTo = getCallbackUrl(appUrl, AUTH_ROUTES.callback);

    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data.url) {
      return { success: false, error: "Could not start Google sign-in." };
    }

    return { success: true, redirectTo: data.url, url: data.url };
  }

  async signOut(): Promise<void> {
    const { error } = await this.supabase.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }
  }

  async forgotPassword(input: ForgotPasswordInput): Promise<AuthResult> {
    const appUrl = await getAppUrl();
    const redirectTo = getCallbackUrl(
      appUrl,
      `${AUTH_ROUTES.callback}?next=${encodeURIComponent(AUTH_ROUTES.resetPassword)}`,
    );

    const { error } = await this.supabase.auth.resetPasswordForEmail(
      input.email,
      { redirectTo },
    );

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      message: "Password reset link sent. Check your email.",
    };
  }

  async resetPassword(input: ResetPasswordInput): Promise<AuthResult> {
    const { error } = await this.supabase.auth.updateUser({
      password: input.password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    const {
      data: { user },
    } = await this.supabase.auth.getUser();

    if (user) {
      await this.profileService.ensureProfile(user);
    }

    return {
      success: true,
      redirectTo: AUTH_ROUTES.login,
    };
  }

  async resendVerificationEmail(email: string): Promise<AuthResult> {
    const appUrl = await getAppUrl();
    const emailRedirectTo = getCallbackUrl(appUrl, AUTH_ROUTES.callback);

    const { error } = await this.supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      message: "Verification email sent. Check your inbox.",
    };
  }

  async handleAuthCallback(user: User): Promise<AuthResult> {
    const profile = await this.profileService.ensureProfile(user);

    return {
      success: true,
      redirectTo: getPostAuthRedirectPath(profile),
    };
  }

  private isEmailVerified(user: User): boolean {
    return Boolean(user.email_confirmed_at);
  }
}
