export type Profile = {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  onboarding_completed: boolean;
  assessment_completed: boolean;
  onboarding_completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateProfileInput = {
  user_id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  onboarding_completed?: boolean;
  assessment_completed?: boolean;
};
