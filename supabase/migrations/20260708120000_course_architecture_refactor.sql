-- =============================================================================
-- Course Architecture Refactor
-- Adds scalable course sections, slots, exercise library, user assignments,
-- current state, and append-only diagnostic history.
--
-- Legacy tables preserved (no drops):
--   sections, exercises, exercise_progress, onboarding_answers, assessment_answers
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

CREATE TYPE public.course_section_status AS ENUM (
  'draft',
  'published',
  'archived'
);

CREATE TYPE public.slot_assignment_type AS ENUM (
  'fixed',
  'rule_based',
  'ai_selected'
);

CREATE TYPE public.exercise_library_status AS ENUM (
  'draft',
  'published',
  'archived'
);

CREATE TYPE public.user_course_assignment_status AS ENUM (
  'assigned',
  'in_progress',
  'completed',
  'skipped'
);

-- ---------------------------------------------------------------------------
-- Course Sections
-- ---------------------------------------------------------------------------

CREATE TABLE public.course_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  status public.course_section_status NOT NULL DEFAULT 'published',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT course_sections_slug_unique UNIQUE (slug),
  CONSTRAINT course_sections_order_index_unique UNIQUE (order_index),
  CONSTRAINT course_sections_order_index_positive CHECK (order_index >= 0)
);

CREATE INDEX course_sections_status_order_idx
  ON public.course_sections (status, order_index);

CREATE TRIGGER course_sections_set_updated_at
  BEFORE UPDATE ON public.course_sections
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Exercise Library (canonical catalog — decoupled from course structure)
-- ---------------------------------------------------------------------------

CREATE TABLE public.exercise_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  content_type public.exercise_content_type NOT NULL DEFAULT 'text',
  duration_min INTEGER,
  media_url TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  status public.exercise_library_status NOT NULL DEFAULT 'published',
  legacy_exercise_id UUID REFERENCES public.exercises (id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT exercise_library_slug_unique UNIQUE (slug),
  CONSTRAINT exercise_library_duration_positive CHECK (
    duration_min IS NULL OR duration_min > 0
  ),
  CONSTRAINT exercise_library_metadata_object CHECK (jsonb_typeof(metadata) = 'object')
);

CREATE INDEX exercise_library_status_idx
  ON public.exercise_library (status);

CREATE INDEX exercise_library_content_type_idx
  ON public.exercise_library (content_type);

CREATE INDEX exercise_library_metadata_gin_idx
  ON public.exercise_library USING gin (metadata jsonb_path_ops);

CREATE INDEX exercise_library_title_trgm_idx
  ON public.exercise_library USING gin (title gin_trgm_ops);

CREATE TRIGGER exercise_library_set_updated_at
  BEFORE UPDATE ON public.exercise_library
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Capabilities (normalized replacement for has_audio / has_video / has_diagnostic)
-- ---------------------------------------------------------------------------

CREATE TABLE public.capability_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL,
  label TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT capability_types_key_unique UNIQUE (key),
  CONSTRAINT capability_types_key_not_empty CHECK (length(trim(key)) > 0)
);

CREATE TABLE public.exercise_library_capabilities (
  exercise_id UUID NOT NULL REFERENCES public.exercise_library (id) ON DELETE CASCADE,
  capability_id UUID NOT NULL REFERENCES public.capability_types (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (exercise_id, capability_id)
);

CREATE INDEX exercise_library_capabilities_capability_idx
  ON public.exercise_library_capabilities (capability_id, exercise_id);

-- ---------------------------------------------------------------------------
-- Exercise Tags (normalized)
-- ---------------------------------------------------------------------------

CREATE TABLE public.exercise_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT exercise_tags_slug_unique UNIQUE (slug),
  CONSTRAINT exercise_tags_name_not_empty CHECK (length(trim(name)) > 0)
);

CREATE INDEX exercise_tags_category_idx ON public.exercise_tags (category);

CREATE TABLE public.exercise_library_tags (
  exercise_id UUID NOT NULL REFERENCES public.exercise_library (id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.exercise_tags (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (exercise_id, tag_id)
);

CREATE INDEX exercise_library_tags_tag_idx
  ON public.exercise_library_tags (tag_id, exercise_id);

-- ---------------------------------------------------------------------------
-- Course Slots (sections contain slots, not exercises directly)
-- ---------------------------------------------------------------------------

CREATE TABLE public.course_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID NOT NULL REFERENCES public.course_sections (id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  assignment_type public.slot_assignment_type NOT NULL,
  fixed_exercise_id UUID REFERENCES public.exercise_library (id) ON DELETE SET NULL,
  selection_rule JSONB,
  ai_selection_config JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT course_slots_section_order_unique UNIQUE (section_id, order_index),
  CONSTRAINT course_slots_order_index_positive CHECK (order_index >= 0),
  CONSTRAINT course_slots_section_slug_unique UNIQUE (section_id, slug),
  CONSTRAINT course_slots_fixed_requires_exercise CHECK (
    assignment_type <> 'fixed' OR fixed_exercise_id IS NOT NULL
  ),
  CONSTRAINT course_slots_rule_requires_config CHECK (
    assignment_type <> 'rule_based' OR selection_rule IS NOT NULL
  ),
  CONSTRAINT course_slots_ai_requires_config CHECK (
    assignment_type <> 'ai_selected' OR ai_selection_config IS NOT NULL
  ),
  CONSTRAINT course_slots_selection_rule_object CHECK (
    selection_rule IS NULL OR jsonb_typeof(selection_rule) = 'object'
  ),
  CONSTRAINT course_slots_ai_config_object CHECK (
    ai_selection_config IS NULL OR jsonb_typeof(ai_selection_config) = 'object'
  )
);

CREATE INDEX course_slots_section_order_idx
  ON public.course_slots (section_id, order_index);

CREATE INDEX course_slots_assignment_type_idx
  ON public.course_slots (assignment_type);

CREATE INDEX course_slots_fixed_exercise_idx
  ON public.course_slots (fixed_exercise_id)
  WHERE fixed_exercise_id IS NOT NULL;

CREATE TRIGGER course_slots_set_updated_at
  BEFORE UPDATE ON public.course_slots
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- User Course (one personalized course instance per user)
-- ---------------------------------------------------------------------------

CREATE TABLE public.user_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users (id) ON DELETE CASCADE,
  course_version TEXT NOT NULL DEFAULT 'v1',
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX user_courses_user_id_idx ON public.user_courses (user_id);

CREATE TRIGGER user_courses_set_updated_at
  BEFORE UPDATE ON public.user_courses
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- User Course Assignments (immutable — exercise per slot never changes)
-- ---------------------------------------------------------------------------

CREATE TABLE public.user_course_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_course_id UUID NOT NULL REFERENCES public.user_courses (id) ON DELETE CASCADE,
  slot_id UUID NOT NULL REFERENCES public.course_slots (id) ON DELETE RESTRICT,
  exercise_id UUID NOT NULL REFERENCES public.exercise_library (id) ON DELETE RESTRICT,
  assignment_type public.slot_assignment_type NOT NULL,
  selection_context JSONB NOT NULL DEFAULT '{}'::jsonb,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT user_course_assignments_course_slot_unique UNIQUE (user_course_id, slot_id),
  CONSTRAINT user_course_assignments_selection_context_object CHECK (
    jsonb_typeof(selection_context) = 'object'
  )
);

CREATE INDEX user_course_assignments_user_course_idx
  ON public.user_course_assignments (user_course_id, assigned_at);

CREATE INDEX user_course_assignments_exercise_idx
  ON public.user_course_assignments (exercise_id);

CREATE INDEX user_course_assignments_slot_idx
  ON public.user_course_assignments (slot_id);

-- Progress is mutable; assignment row is not.
CREATE TABLE public.user_course_assignment_progress (
  assignment_id UUID PRIMARY KEY REFERENCES public.user_course_assignments (id) ON DELETE CASCADE,
  status public.user_course_assignment_status NOT NULL DEFAULT 'assigned',
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT user_course_assignment_progress_started_check CHECK (
    status = 'assigned' OR started_at IS NOT NULL
  ),
  CONSTRAINT user_course_assignment_progress_completed_check CHECK (
    status <> 'completed' OR completed_at IS NOT NULL
  )
);

CREATE INDEX user_course_assignment_progress_status_idx
  ON public.user_course_assignment_progress (status);

CREATE TRIGGER user_course_assignment_progress_set_updated_at
  BEFORE UPDATE ON public.user_course_assignment_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- User Current State (mutable snapshot of where the user is now)
-- ---------------------------------------------------------------------------

CREATE TABLE public.user_current_state (
  user_id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  emotion TEXT,
  body_state TEXT,
  loss_type TEXT,
  loss_date DATE,
  healing_goal TEXT,
  latest_diagnostic_id UUID,
  current_section_id UUID REFERENCES public.course_sections (id) ON DELETE SET NULL,
  current_slot_id UUID REFERENCES public.course_slots (id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX user_current_state_section_idx
  ON public.user_current_state (current_section_id);

CREATE INDEX user_current_state_slot_idx
  ON public.user_current_state (current_slot_id);

CREATE TRIGGER user_current_state_set_updated_at
  BEFORE UPDATE ON public.user_current_state
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Diagnostic Responses (append-only history — never overwrite)
-- ---------------------------------------------------------------------------

CREATE TABLE public.diagnostic_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES public.exercise_library (id) ON DELETE SET NULL,
  slot_id UUID REFERENCES public.course_slots (id) ON DELETE SET NULL,
  assignment_id UUID REFERENCES public.user_course_assignments (id) ON DELETE SET NULL,
  question_key TEXT NOT NULL,
  answer_text TEXT NOT NULL,
  answer_json JSONB,
  responded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT diagnostic_responses_question_key_not_empty CHECK (
    length(trim(question_key)) > 0
  ),
  CONSTRAINT diagnostic_responses_answer_json_object CHECK (
    answer_json IS NULL OR jsonb_typeof(answer_json) = 'object'
  )
);

CREATE INDEX diagnostic_responses_user_responded_idx
  ON public.diagnostic_responses (user_id, responded_at DESC);

CREATE INDEX diagnostic_responses_user_question_idx
  ON public.diagnostic_responses (user_id, question_key, responded_at DESC);

CREATE INDEX diagnostic_responses_exercise_idx
  ON public.diagnostic_responses (exercise_id);

CREATE INDEX diagnostic_responses_assignment_idx
  ON public.diagnostic_responses (assignment_id);

-- Link latest diagnostic after diagnostic_responses exists.
ALTER TABLE public.user_current_state
  ADD CONSTRAINT user_current_state_latest_diagnostic_fkey
  FOREIGN KEY (latest_diagnostic_id)
  REFERENCES public.diagnostic_responses (id)
  ON DELETE SET NULL;

-- ---------------------------------------------------------------------------
-- Immutability guards
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.prevent_row_mutation()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION '% rows are immutable and cannot be %', TG_TABLE_NAME, lower(TG_OP);
END;
$$;

CREATE TRIGGER user_course_assignments_immutable
  BEFORE UPDATE OR DELETE ON public.user_course_assignments
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_row_mutation();

CREATE TRIGGER diagnostic_responses_immutable
  BEFORE UPDATE OR DELETE ON public.diagnostic_responses
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_row_mutation();

-- ---------------------------------------------------------------------------
-- Seed capability types
-- ---------------------------------------------------------------------------

INSERT INTO public.capability_types (key, label)
VALUES
  ('audio', 'Audio'),
  ('video', 'Video'),
  ('diagnostic', 'Diagnostic')
ON CONFLICT (key) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Backfill from legacy sections / exercises (non-destructive)
-- ---------------------------------------------------------------------------

INSERT INTO public.course_sections (id, slug, title, description, order_index, status)
SELECT
  s.id,
  'section-' || s.order_index::text,
  s.title,
  s.description,
  s.order_index,
  'published'::public.course_section_status
FROM public.sections AS s
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.exercise_library (
  id,
  slug,
  title,
  description,
  content,
  content_type,
  duration_min,
  media_url,
  metadata,
  status,
  legacy_exercise_id
)
SELECT
  e.id,
  'exercise-' || replace(e.id::text, '-', ''),
  e.title,
  e.description,
  e.content_text,
  e.content_type,
  e.duration_min,
  e.content_url,
  jsonb_build_object(
    'legacy_section_id', e.section_id,
    'legacy_order_index', e.order_index
  ),
  'published'::public.exercise_library_status,
  e.id
FROM public.exercises AS e
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.exercise_library_capabilities (exercise_id, capability_id)
SELECT
  el.id,
  ct.id
FROM public.exercise_library AS el
JOIN public.exercises AS e ON e.id = el.legacy_exercise_id
JOIN public.capability_types AS ct ON (
  (e.content_type IN ('audio', 'mixed') AND ct.key = 'audio')
  OR (e.content_type IN ('video', 'mixed') AND ct.key = 'video')
)
ON CONFLICT DO NOTHING;

INSERT INTO public.course_slots (
  id,
  section_id,
  slug,
  title,
  description,
  order_index,
  assignment_type,
  fixed_exercise_id
)
SELECT
  gen_random_uuid(),
  e.section_id,
  'slot-' || e.order_index::text,
  e.title,
  e.description,
  e.order_index,
  'fixed'::public.slot_assignment_type,
  el.id
FROM public.exercises AS e
JOIN public.exercise_library AS el ON el.legacy_exercise_id = e.id
ON CONFLICT (section_id, order_index) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

ALTER TABLE public.course_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.capability_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_library_capabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_library_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_course_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_course_assignment_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_current_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnostic_responses ENABLE ROW LEVEL SECURITY;

-- Catalog: authenticated read (published content only where applicable)
CREATE POLICY "course_sections_select_published"
  ON public.course_sections
  FOR SELECT
  TO authenticated
  USING (status = 'published');

CREATE POLICY "course_slots_select_authenticated"
  ON public.course_slots
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.course_sections AS cs
      WHERE cs.id = course_slots.section_id
        AND cs.status = 'published'
    )
  );

CREATE POLICY "exercise_library_select_published"
  ON public.exercise_library
  FOR SELECT
  TO authenticated
  USING (status = 'published');

CREATE POLICY "capability_types_select_authenticated"
  ON public.capability_types
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "exercise_library_capabilities_select_authenticated"
  ON public.exercise_library_capabilities
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "exercise_tags_select_authenticated"
  ON public.exercise_tags
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "exercise_library_tags_select_authenticated"
  ON public.exercise_library_tags
  FOR SELECT
  TO authenticated
  USING (true);

-- User-owned tables
CREATE POLICY "user_courses_select_own"
  ON public.user_courses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "user_courses_insert_own"
  ON public.user_courses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_courses_update_own"
  ON public.user_courses
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_course_assignments_select_own"
  ON public.user_course_assignments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.user_courses AS uc
      WHERE uc.id = user_course_assignments.user_course_id
        AND uc.user_id = auth.uid()
    )
  );

CREATE POLICY "user_course_assignments_insert_own"
  ON public.user_course_assignments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.user_courses AS uc
      WHERE uc.id = user_course_assignments.user_course_id
        AND uc.user_id = auth.uid()
    )
  );

CREATE POLICY "user_course_assignment_progress_select_own"
  ON public.user_course_assignment_progress
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.user_course_assignments AS uca
      JOIN public.user_courses AS uc ON uc.id = uca.user_course_id
      WHERE uca.id = user_course_assignment_progress.assignment_id
        AND uc.user_id = auth.uid()
    )
  );

CREATE POLICY "user_course_assignment_progress_insert_own"
  ON public.user_course_assignment_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.user_course_assignments AS uca
      JOIN public.user_courses AS uc ON uc.id = uca.user_course_id
      WHERE uca.id = user_course_assignment_progress.assignment_id
        AND uc.user_id = auth.uid()
    )
  );

CREATE POLICY "user_course_assignment_progress_update_own"
  ON public.user_course_assignment_progress
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.user_course_assignments AS uca
      JOIN public.user_courses AS uc ON uc.id = uca.user_course_id
      WHERE uca.id = user_course_assignment_progress.assignment_id
        AND uc.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.user_course_assignments AS uca
      JOIN public.user_courses AS uc ON uc.id = uca.user_course_id
      WHERE uca.id = user_course_assignment_progress.assignment_id
        AND uc.user_id = auth.uid()
    )
  );

CREATE POLICY "user_current_state_select_own"
  ON public.user_current_state
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "user_current_state_insert_own"
  ON public.user_current_state
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_current_state_update_own"
  ON public.user_current_state
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "diagnostic_responses_select_own"
  ON public.diagnostic_responses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "diagnostic_responses_insert_own"
  ON public.diagnostic_responses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Grants
-- ---------------------------------------------------------------------------

GRANT SELECT ON public.course_sections TO authenticated;
GRANT SELECT ON public.course_slots TO authenticated;
GRANT SELECT ON public.exercise_library TO authenticated;
GRANT SELECT ON public.capability_types TO authenticated;
GRANT SELECT ON public.exercise_library_capabilities TO authenticated;
GRANT SELECT ON public.exercise_tags TO authenticated;
GRANT SELECT ON public.exercise_library_tags TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.user_courses TO authenticated;
GRANT SELECT, INSERT ON public.user_course_assignments TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.user_course_assignment_progress TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.user_current_state TO authenticated;
GRANT SELECT, INSERT ON public.diagnostic_responses TO authenticated;

GRANT USAGE ON TYPE public.course_section_status TO authenticated;
GRANT USAGE ON TYPE public.slot_assignment_type TO authenticated;
GRANT USAGE ON TYPE public.exercise_library_status TO authenticated;
GRANT USAGE ON TYPE public.user_course_assignment_status TO authenticated;
