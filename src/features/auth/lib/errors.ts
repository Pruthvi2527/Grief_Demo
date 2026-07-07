const AUTH_ERROR_MESSAGES: Record<string, string> = {
  auth_code_missing: "Sign-in was interrupted. Please try again.",
  auth_user_missing: "Could not load your account after sign-in. Please try again.",
  oauth_url_missing: "Could not start Google sign-in. Please try again.",
  oauth_start_failed: "Could not start Google sign-in. Please try again.",
  auth_callback_error: "Sign-in failed during callback. Please try again.",
  profile_setup_failed: "Your account was created but profile setup failed. Please try again.",
  password_reset_success: "Your password has been updated. You can sign in now.",
};

const AUTH_SUCCESS_MESSAGES: Record<string, string> = {
  password_reset_success: AUTH_ERROR_MESSAGES.password_reset_success,
};

export function getAuthErrorMessage(error?: string | null) {
  if (!error) {
    return null;
  }

  if (AUTH_ERROR_MESSAGES[error]) {
    return AUTH_ERROR_MESSAGES[error];
  }

  if (error.includes("provider is not enabled")) {
    return "Google sign-in is not enabled in Supabase yet. Enable the Google provider under Authentication → Providers in your Supabase dashboard, then add your Google OAuth client ID and secret.";
  }

  if (error.includes("Invalid login credentials")) {
    return "Invalid email or password. Please try again.";
  }

  if (error.includes("Email not confirmed")) {
    return "Please verify your email before signing in.";
  }

  if (error.includes("Failed to create profile") || error.includes("Failed to fetch profile")) {
    return AUTH_ERROR_MESSAGES.profile_setup_failed;
  }

  return error;
}

export function getAuthSuccessMessage(message?: string | null) {
  if (!message) {
    return null;
  }

  return AUTH_SUCCESS_MESSAGES[message] ?? message;
}
