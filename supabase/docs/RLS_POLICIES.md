# Supabase RLS Policies — Course Architecture

> Policies are defined in `supabase/migrations/20260708120000_course_architecture_refactor.sql`.
> Legacy MVP policies remain in `20260706120000_grief_course_mvp_schema.sql`.

## Policy Matrix

### Catalog (read-only for `authenticated`)

| Table | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| `course_sections` | Published only | — | — | — |
| `course_slots` | Published section slots | — | — | — |
| `exercise_library` | Published only | — | — | — |
| `capability_types` | All | — | — | — |
| `exercise_library_capabilities` | All | — | — | — |
| `exercise_tags` | All | — | — | — |
| `exercise_library_tags` | All | — | — | — |

> Catalog writes should be performed via `service_role` (admin scripts / CMS), not client SDK.

### User-owned data

| Table | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| `user_courses` | Own | Own | Own | — |
| `user_course_assignments` | Own | Own | **Blocked** | **Blocked** |
| `user_course_assignment_progress` | Own | Own | Own | — |
| `user_current_state` | Own | Own | Own | — |
| `diagnostic_responses` | Own | Own | **Blocked** | **Blocked** |

### Immutability enforcement

| Table | Mechanism |
|---|---|
| `user_course_assignments` | `BEFORE UPDATE OR DELETE` trigger → raises exception |
| `diagnostic_responses` | `BEFORE UPDATE OR DELETE` trigger → raises exception |
| RLS | No UPDATE/DELETE policies on immutable tables |

## Security model

```
┌─────────────────────────────────────────────────────────┐
│                    authenticated                         │
├─────────────────────────────────────────────────────────┤
│  READ published catalog (sections, slots, library)     │
│  READ/WRITE own user_courses + current_state             │
│  INSERT assignments (once) — never update                │
│  INSERT diagnostic_responses — never update              │
│  UPDATE assignment_progress only                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    service_role                          │
├─────────────────────────────────────────────────────────┤
│  Full catalog CRUD (bypasses RLS)                        │
│  Course assignment orchestration (server-side)           │
│  AI / rule engine resolution at assignment time          │
└─────────────────────────────────────────────────────────┘
```

## Recommended server-side flows

### 1. Course assignment (immutable)

```sql
-- Pseudocode transaction (service_role)
BEGIN;
  INSERT INTO user_courses (user_id) VALUES ($user_id)
  ON CONFLICT (user_id) DO NOTHING;

  -- For each slot: resolve exercise, insert assignment ONCE
  INSERT INTO user_course_assignments (...)
  VALUES (...);

  INSERT INTO user_course_assignment_progress (assignment_id)
  VALUES (...);
COMMIT;
```

### 2. Diagnostic capture (append-only)

```sql
INSERT INTO diagnostic_responses (user_id, question_key, answer_text, ...)
VALUES (...);

UPDATE user_current_state
SET latest_diagnostic_id = $new_id, updated_at = NOW()
WHERE user_id = $user_id;
```

### 3. Progress update (mutable)

```sql
UPDATE user_course_assignment_progress
SET status = 'completed', completed_at = NOW()
WHERE assignment_id = $assignment_id;
```

## Legacy tables (unchanged)

| Table | Policies |
|---|---|
| `sections` | SELECT authenticated |
| `exercises` | SELECT authenticated |
| `exercise_progress` | Full CRUD own |
| `onboarding_answers` | Full CRUD own |
| `assessment_answers` | Full CRUD own (upsert in app — consider migrating to `diagnostic_responses`) |
| `profiles` | SELECT/INSERT/UPDATE own |

## Future hardening

- Add `service_role`-only policies for catalog INSERT/UPDATE
- Move assignment creation to Edge Function with `service_role`
- Add audit log table for AI selection decisions
- Partition `diagnostic_responses` by month at 1M+ rows
