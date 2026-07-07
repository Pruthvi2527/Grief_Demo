  -- Grief Course MVP — initial schema
  -- Run via Supabase CLI: supabase db push
  -- Or apply manually in Supabase Dashboard → SQL Editor

  -- ---------------------------------------------------------------------------
  -- Extensions
  -- ---------------------------------------------------------------------------

  CREATE EXTENSION IF NOT EXISTS "pgcrypto";

  -- ---------------------------------------------------------------------------
  -- Helpers
  -- ---------------------------------------------------------------------------

  CREATE OR REPLACE FUNCTION public.set_updated_at()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  AS $$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
  $$;

  -- ---------------------------------------------------------------------------
  -- profiles
  -- ---------------------------------------------------------------------------

  CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users (id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    onboarding_completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE INDEX profiles_user_id_idx ON public.profiles (user_id);

  CREATE TRIGGER profiles_set_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

  -- Auto-create profile when a user signs up
  CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
  AS $$
  BEGIN
    INSERT INTO public.profiles (user_id)
    VALUES (NEW.id);
    RETURN NEW;
  END;
  $$;

  CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

  -- ---------------------------------------------------------------------------
  -- sections
  -- ---------------------------------------------------------------------------

  CREATE TABLE public.sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT sections_order_index_positive CHECK (order_index >= 0),
    CONSTRAINT sections_order_index_unique UNIQUE (order_index)
  );

  CREATE INDEX sections_order_index_idx ON public.sections (order_index);

  CREATE TRIGGER sections_set_updated_at
    BEFORE UPDATE ON public.sections
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

  -- ---------------------------------------------------------------------------
  -- exercises
  -- ---------------------------------------------------------------------------

  CREATE TYPE public.exercise_content_type AS ENUM (
    'audio',
    'text',
    'video',
    'mixed'
  );

  CREATE TABLE public.exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id UUID NOT NULL REFERENCES public.sections (id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    content_type public.exercise_content_type NOT NULL DEFAULT 'text',
    content_text TEXT,
    content_url TEXT,
    order_index INTEGER NOT NULL,
    duration_min INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT exercises_order_index_positive CHECK (order_index >= 0),
    CONSTRAINT exercises_duration_positive CHECK (
      duration_min IS NULL OR duration_min > 0
    ),
    CONSTRAINT exercises_section_order_unique UNIQUE (section_id, order_index)
  );

  CREATE INDEX exercises_section_id_idx ON public.exercises (section_id);
  CREATE INDEX exercises_section_order_idx ON public.exercises (section_id, order_index);

  CREATE TRIGGER exercises_set_updated_at
    BEFORE UPDATE ON public.exercises
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

  -- ---------------------------------------------------------------------------
  -- onboarding_answers
  -- ---------------------------------------------------------------------------

  CREATE TABLE public.onboarding_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
    question_key TEXT NOT NULL,
    answer_text TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT onboarding_answers_question_key_not_empty CHECK (
      length(trim(question_key)) > 0
    ),
    CONSTRAINT onboarding_answers_user_question_unique UNIQUE (user_id, question_key)
  );

  CREATE INDEX onboarding_answers_user_id_idx ON public.onboarding_answers (user_id);
  CREATE INDEX onboarding_answers_question_key_idx ON public.onboarding_answers (question_key);

  CREATE TRIGGER onboarding_answers_set_updated_at
    BEFORE UPDATE ON public.onboarding_answers
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

  -- ---------------------------------------------------------------------------
  -- assessment_answers
  -- ---------------------------------------------------------------------------

  CREATE TABLE public.assessment_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
    exercise_id UUID REFERENCES public.exercises (id) ON DELETE SET NULL,
    question_key TEXT NOT NULL,
    answer_text TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT assessment_answers_question_key_not_empty CHECK (
      length(trim(question_key)) > 0
    )
  );

  CREATE INDEX assessment_answers_user_id_idx ON public.assessment_answers (user_id);
  CREATE INDEX assessment_answers_exercise_id_idx ON public.assessment_answers (exercise_id);
  CREATE INDEX assessment_answers_user_exercise_idx ON public.assessment_answers (user_id, exercise_id);
  CREATE INDEX assessment_answers_question_key_idx ON public.assessment_answers (question_key);

  CREATE TRIGGER assessment_answers_set_updated_at
    BEFORE UPDATE ON public.assessment_answers
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

  -- ---------------------------------------------------------------------------
  -- exercise_progress
  -- ---------------------------------------------------------------------------

  CREATE TYPE public.exercise_progress_status AS ENUM (
    'not_started',
    'in_progress',
    'completed'
  );

  CREATE TABLE public.exercise_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES public.exercises (id) ON DELETE CASCADE,
    status public.exercise_progress_status NOT NULL DEFAULT 'not_started',
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT exercise_progress_user_exercise_unique UNIQUE (user_id, exercise_id),
    CONSTRAINT exercise_progress_started_at_check CHECK (
      status = 'not_started' OR started_at IS NOT NULL
    ),
    CONSTRAINT exercise_progress_completed_at_check CHECK (
      status <> 'completed' OR completed_at IS NOT NULL
    )
  );

  CREATE INDEX exercise_progress_user_id_idx ON public.exercise_progress (user_id);
  CREATE INDEX exercise_progress_exercise_id_idx ON public.exercise_progress (exercise_id);
  CREATE INDEX exercise_progress_user_status_idx ON public.exercise_progress (user_id, status);
  CREATE INDEX exercise_progress_user_updated_idx ON public.exercise_progress (user_id, updated_at DESC);

  CREATE TRIGGER exercise_progress_set_updated_at
    BEFORE UPDATE ON public.exercise_progress
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

  -- ---------------------------------------------------------------------------
  -- Row Level Security
  -- ---------------------------------------------------------------------------

  ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.onboarding_answers ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.assessment_answers ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.exercise_progress ENABLE ROW LEVEL SECURITY;

  -- profiles: users manage their own row
  CREATE POLICY "profiles_select_own"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

  CREATE POLICY "profiles_insert_own"
    ON public.profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "profiles_update_own"
    ON public.profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

  -- sections & exercises: read-only catalog for authenticated users
  CREATE POLICY "sections_select_authenticated"
    ON public.sections
    FOR SELECT
    TO authenticated
    USING (true);

  CREATE POLICY "exercises_select_authenticated"
    ON public.exercises
    FOR SELECT
    TO authenticated
    USING (true);

  -- onboarding_answers: users manage their own answers
  CREATE POLICY "onboarding_answers_select_own"
    ON public.onboarding_answers
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

  CREATE POLICY "onboarding_answers_insert_own"
    ON public.onboarding_answers
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "onboarding_answers_update_own"
    ON public.onboarding_answers
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "onboarding_answers_delete_own"
    ON public.onboarding_answers
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

  -- assessment_answers: users manage their own answers
  CREATE POLICY "assessment_answers_select_own"
    ON public.assessment_answers
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

  CREATE POLICY "assessment_answers_insert_own"
    ON public.assessment_answers
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "assessment_answers_update_own"
    ON public.assessment_answers
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "assessment_answers_delete_own"
    ON public.assessment_answers
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

  -- exercise_progress: users manage their own progress
  CREATE POLICY "exercise_progress_select_own"
    ON public.exercise_progress
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

  CREATE POLICY "exercise_progress_insert_own"
    ON public.exercise_progress
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "exercise_progress_update_own"
    ON public.exercise_progress
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "exercise_progress_delete_own"
    ON public.exercise_progress
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

  -- ---------------------------------------------------------------------------
  -- Grants
  -- ---------------------------------------------------------------------------

  GRANT USAGE ON SCHEMA public TO authenticated;
  GRANT SELECT ON public.sections TO authenticated;
  GRANT SELECT ON public.exercises TO authenticated;
  GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
  GRANT SELECT, INSERT, UPDATE, DELETE ON public.onboarding_answers TO authenticated;
  GRANT SELECT, INSERT, UPDATE, DELETE ON public.assessment_answers TO authenticated;
  GRANT SELECT, INSERT, UPDATE, DELETE ON public.exercise_progress TO authenticated;

  GRANT USAGE ON TYPE public.exercise_content_type TO authenticated;
  GRANT USAGE ON TYPE public.exercise_progress_status TO authenticated;
