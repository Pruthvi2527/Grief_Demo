# Course Database ER Diagram

> Generated for the course architecture refactor (`20260708120000_course_architecture_refactor.sql`).
> Legacy MVP tables are preserved for backward compatibility.

## Mermaid ER Diagram

```mermaid
erDiagram
  auth_users ||--o| profiles : has
  auth_users ||--o| user_courses : owns
  auth_users ||--o| user_current_state : tracks
  auth_users ||--o{ diagnostic_responses : submits
  auth_users ||--o{ onboarding_answers : submits
  auth_users ||--o{ assessment_answers : submits
  auth_users ||--o{ exercise_progress : tracks

  course_sections ||--o{ course_slots : contains
  course_slots }o--o| exercise_library : "fixed_exercise"
  exercise_library ||--o{ exercise_library_capabilities : has
  capability_types ||--o{ exercise_library_capabilities : defines
  exercise_library ||--o{ exercise_library_tags : tagged
  exercise_tags ||--o{ exercise_library_tags : defines

  user_courses ||--o{ user_course_assignments : assigns
  course_slots ||--o{ user_course_assignments : fills
  exercise_library ||--o{ user_course_assignments : selected_for
  user_course_assignments ||--|| user_course_assignment_progress : progresses

  user_current_state }o--o| course_sections : current_section
  user_current_state }o--o| course_slots : current_slot
  user_current_state }o--o| diagnostic_responses : latest_diagnostic

  diagnostic_responses }o--o| exercise_library : about
  diagnostic_responses }o--o| course_slots : in_slot
  diagnostic_responses }o--o| user_course_assignments : for_assignment

  sections ||--o{ exercises : "legacy"
  exercises ||--o| exercise_library : legacy_exercise_id

  course_sections {
    uuid id PK
    text slug UK
    text title
    text description
    int order_index UK
    course_section_status status
    timestamptz created_at
    timestamptz updated_at
  }

  course_slots {
    uuid id PK
    uuid section_id FK
    text slug
    text title
    text description
    int order_index
    slot_assignment_type assignment_type
    uuid fixed_exercise_id FK
    jsonb selection_rule
    jsonb ai_selection_config
    timestamptz created_at
    timestamptz updated_at
  }

  exercise_library {
    uuid id PK
    text slug UK
    text title
    text description
    text content
    exercise_content_type content_type
    int duration_min
    text media_url
    jsonb metadata
    exercise_library_status status
    uuid legacy_exercise_id FK
    timestamptz created_at
    timestamptz updated_at
  }

  capability_types {
    uuid id PK
    text key UK
    text label
    timestamptz created_at
  }

  exercise_library_capabilities {
    uuid exercise_id PK,FK
    uuid capability_id PK,FK
    timestamptz created_at
  }

  exercise_tags {
    uuid id PK
    text slug UK
    text name
    text category
    timestamptz created_at
  }

  exercise_library_tags {
    uuid exercise_id PK,FK
    uuid tag_id PK,FK
    timestamptz created_at
  }

  user_courses {
    uuid id PK
    uuid user_id UK,FK
    text course_version
    timestamptz assigned_at
    timestamptz created_at
    timestamptz updated_at
  }

  user_course_assignments {
    uuid id PK
    uuid user_course_id FK
    uuid slot_id FK
    uuid exercise_id FK
    slot_assignment_type assignment_type
    jsonb selection_context
    timestamptz assigned_at
  }

  user_course_assignment_progress {
    uuid assignment_id PK,FK
    user_course_assignment_status status
    timestamptz started_at
    timestamptz completed_at
    timestamptz created_at
    timestamptz updated_at
  }

  user_current_state {
    uuid user_id PK,FK
    text emotion
    text body_state
    text loss_type
    date loss_date
    text healing_goal
    uuid latest_diagnostic_id FK
    uuid current_section_id FK
    uuid current_slot_id FK
    timestamptz created_at
    timestamptz updated_at
  }

  diagnostic_responses {
    uuid id PK
    uuid user_id FK
    uuid exercise_id FK
    uuid slot_id FK
    uuid assignment_id FK
    text question_key
    text answer_text
    jsonb answer_json
    timestamptz responded_at
    timestamptz created_at
  }
```

## Architecture Notes

### Layering

| Layer | Tables | Purpose |
|---|---|---|
| **Catalog** | `course_sections`, `course_slots`, `exercise_library`, tags, capabilities | Immutable course definition + exercise pool (500+ scalable) |
| **Personalization** | `user_courses`, `user_course_assignments` | Per-user frozen exercise selections |
| **Runtime** | `user_course_assignment_progress`, `user_current_state` | Mutable progress and position |
| **History** | `diagnostic_responses` | Append-only diagnostic answers |
| **Legacy** | `sections`, `exercises`, `exercise_progress` | MVP compatibility (unchanged) |

### Slot Assignment Types

| Type | `course_slots` fields | Resolution |
|---|---|---|
| `fixed` | `fixed_exercise_id` | Always the same library exercise |
| `rule_based` | `selection_rule` (JSONB) | Resolved at assignment time from rules + user state |
| `ai_selected` | `ai_selection_config` (JSONB) | Resolved by AI at assignment time |

### Immutability

- `user_course_assignments` — **no UPDATE/DELETE** (trigger enforced)
- `diagnostic_responses` — **no UPDATE/DELETE** (append-only history)
- Progress changes go to `user_course_assignment_progress` only

### Normalized Capabilities (no booleans on exercises)

Instead of `has_audio`, `has_video`, `has_diagnostic`:

```
exercise_library → exercise_library_capabilities → capability_types
```

### Indexing Strategy (500+ exercises)

- B-tree on `exercise_library(status, content_type)`
- GIN on `exercise_library.metadata`
- GIN trigram on `exercise_library.title` (search)
- Junction table indexes on `(tag_id, exercise_id)` and `(capability_id, exercise_id)`
