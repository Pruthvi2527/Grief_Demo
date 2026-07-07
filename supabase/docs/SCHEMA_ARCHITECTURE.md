# Course Schema Architecture

## Executive Summary

This refactor introduces a **catalog → personalization → runtime → history** model while **preserving all MVP tables** (`sections`, `exercises`, `exercise_progress`, `onboarding_answers`, `assessment_answers`, `profiles`).

The existing frontend continues to work against legacy tables. New services can adopt the v2 schema incrementally.

## Deliverables

| Artifact | Path |
|---|---|
| SQL Migration | `supabase/migrations/20260708120000_course_architecture_refactor.sql` |
| ER Diagram | `supabase/docs/ER_DIAGRAM.md` |
| RLS Documentation | `supabase/docs/RLS_POLICIES.md` |
| TypeScript Types | `src/types/database.course.ts` |

## Requirement Mapping

| Requirement | Implementation |
|---|---|
| Course Sections | `course_sections` (status enum, ordered, slugged) |
| Course Slots | `course_slots` per section with `assignment_type` enum |
| Fixed / Rule / AI exercises | `fixed_exercise_id`, `selection_rule`, `ai_selection_config` |
| Exercise Library | `exercise_library` decoupled from course structure |
| Exercise fields | `content`, `content_type`, `duration_min`, `media_url`, `metadata` JSONB |
| No boolean flags | `capability_types` + `exercise_library_capabilities` junction |
| Exercise Tags | `exercise_tags` + `exercise_library_tags` junction |
| User Course | `user_courses` (one per user) |
| Immutable assignments | `user_course_assignments` + DB trigger (no UPDATE/DELETE) |
| Mutable progress | `user_course_assignment_progress` (separate table) |
| User Current State | `user_current_state` (emotion, body, loss, goals, position) |
| Diagnostic history | `diagnostic_responses` append-only (no UPDATE/DELETE) |
| 500+ exercises | GIN metadata index, trigram title search, junction indexes |

## Data Flow

```
1. Admin seeds course_sections + course_slots + exercise_library
2. On enrollment, server resolves each slot → exercise_id
3. INSERT user_course_assignments (frozen forever)
4. User progresses via user_course_assignment_progress
5. Diagnostics INSERT diagnostic_responses (history)
6. user_current_state updated with latest pointer
```

## Legacy Compatibility

- `sections` / `exercises` — untouched
- Backfill copies MVP data into v2 tables with stable IDs
- `exercise_library.legacy_exercise_id` links to old `exercises.id`
- `course_sections.id` matches `sections.id` where backfilled

## Apply Migration

```bash
supabase db push
```

Or run the SQL file in Supabase Dashboard → SQL Editor.

## Next Steps (backend, not frontend)

1. **Assignment service** — resolve `rule_based` and `ai_selected` slots at enrollment
2. **Migrate assessment** — write new answers to `diagnostic_responses` instead of upserting `assessment_answers`
3. **Dual-read adapter** — dashboard reads v2 when `user_courses` exists, else legacy
4. **CMS admin** — `service_role` scripts for catalog management
