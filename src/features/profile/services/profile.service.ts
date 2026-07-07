import type { User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

import type { CreateProfileInput, Profile } from "../types";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export class ProfileService {
  constructor(
    private readonly supabase: Awaited<ReturnType<typeof createClient>>,
  ) {}

  static async create() {
    const supabase = await createClient();
    return new ProfileService(supabase);
  }

  async findByUserId(userId: string): Promise<Profile | null> {
    const { data, error } = await this.supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to fetch profile: ${error.message}`);
    }

    return data ? this.mapRow(data) : null;
  }

  async createFromAuthUser(user: User): Promise<Profile> {
    return this.createProfile(this.mapAuthUserToProfileInput(user));
  }

  /**
   * Ensures a profile exists for the authenticated user.
   * Creates one from OAuth metadata when missing.
   */
  async ensureProfile(user: User): Promise<Profile> {
    const existing = await this.findByUserId(user.id);

    if (existing) {
      return this.hydrateProfileFromAuthUser(existing, user);
    }

    return this.createFromAuthUser(user);
  }

  async markOnboardingComplete(userId: string): Promise<Profile> {
    const { data, error } = await this.supabase
      .from("profiles")
      .update({
        onboarding_completed: true,
        onboarding_completed_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .select("*")
      .single();

    if (error) {
      throw new Error(`Failed to complete onboarding: ${error.message}`);
    }

    return this.mapRow(data);
  }

  async markAssessmentComplete(userId: string): Promise<Profile> {
    const { data, error } = await this.supabase
      .from("profiles")
      .update({
        assessment_completed: true,
      })
      .eq("user_id", userId)
      .select("*")
      .single();

    if (error) {
      throw new Error(`Failed to complete assessment: ${error.message}`);
    }

    return this.mapRow(data);
  }

  private async createProfile(input: CreateProfileInput): Promise<Profile> {
    const payload: ProfileInsert = {
      user_id: input.user_id,
      email: input.email,
      full_name: input.full_name,
      avatar_url: input.avatar_url,
      onboarding_completed: input.onboarding_completed ?? false,
      assessment_completed: input.assessment_completed ?? false,
    };

    const { data, error } = await this.supabase
      .from("profiles")
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      throw new Error(`Failed to create profile: ${error.message}`);
    }

    return this.mapRow(data);
  }

  private async hydrateProfileFromAuthUser(
    profile: Profile,
    user: User,
  ): Promise<Profile> {
    const authProfile = this.mapAuthUserToProfileInput(user);
    const needsHydration =
      !profile.email ||
      (!profile.full_name && authProfile.full_name) ||
      (!profile.avatar_url && authProfile.avatar_url);

    if (!needsHydration) {
      return profile;
    }

    const updates: ProfileUpdate = {
      email: profile.email ?? authProfile.email,
      full_name: profile.full_name ?? authProfile.full_name,
      avatar_url: profile.avatar_url ?? authProfile.avatar_url,
    };

    const { data, error } = await this.supabase
      .from("profiles")
      .update(updates)
      .eq("id", profile.id)
      .select("*")
      .single();

    if (error) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }

    return this.mapRow(data);
  }

  private mapAuthUserToProfileInput(user: User): CreateProfileInput {
    const metadata = user.user_metadata ?? {};

    return {
      user_id: user.id,
      email: user.email ?? null,
      full_name:
        this.readMetadataString(metadata, "full_name") ??
        this.readMetadataString(metadata, "name"),
      avatar_url:
        this.readMetadataString(metadata, "avatar_url") ??
        this.readMetadataString(metadata, "picture"),
      onboarding_completed: false,
      assessment_completed: false,
    };
  }

  private readMetadataString(
    metadata: Record<string, unknown>,
    key: string,
  ): string | null {
    const value = metadata[key];
    return typeof value === "string" && value.length > 0 ? value : null;
  }

  private mapRow(row: ProfileRow): Profile {
    return {
      id: row.id,
      user_id: row.user_id,
      email: row.email,
      full_name: row.full_name,
      avatar_url: row.avatar_url,
      onboarding_completed: row.onboarding_completed,
      assessment_completed: row.assessment_completed,
      onboarding_completed_at: row.onboarding_completed_at,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  }
}
