-- Add auth-derived profile fields and completion flags.
-- Profile creation is handled by the application ProfileService after OAuth.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS assessment_completed BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles (email);

-- Remove DB trigger; ProfileService owns profile creation after authentication.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
