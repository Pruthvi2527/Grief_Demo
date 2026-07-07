import type { User } from "@supabase/supabase-js";

export type AuthProviderLabel = "Google" | "Email";

export function resolveAuthProvider(user: User): AuthProviderLabel {
  const provider =
    user.app_metadata?.provider ??
    user.identities?.find((identity) => identity.provider)?.provider;

  if (provider === "google") {
    return "Google";
  }

  return "Email";
}

export function formatMemberSince(createdAt: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date(createdAt));
}

export function getDisplayName(fullName: string | null, email: string | null): string {
  if (fullName?.trim()) {
    return fullName.trim();
  }

  if (email) {
    return email.split("@")[0] ?? "Member";
  }

  return "Member";
}

export function getInitials(fullName: string | null, email: string | null): string {
  const displayName = getDisplayName(fullName, email);
  const parts = displayName.split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
  }

  return displayName.slice(0, 2).toUpperCase();
}
