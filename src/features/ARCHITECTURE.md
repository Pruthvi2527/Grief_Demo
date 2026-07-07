# Feature-Based Architecture

Target layout for the bonds app. Pages live in `src/app/` and import from features.

## Target Features

| Feature | Responsibility |
|---|---|
| `auth` | Authentication, sessions, protected routes |
| `dashboard` | My Tree home, shell, journey summary |
| `exercise` | Exercise player UI and session flow |
| `profile` | User profile and account settings |
| `progress` | Completion tracking and progress calculations |
| `recommendation` | AI / rule-based exercise selection |
| `diagnostics` | Diagnostic questions and response history |
| `course` | Course sections, slots, exercise library catalog |

## Standard Module Shape

Each feature follows the same internal structure:

```
src/features/<feature>/
├── index.ts              # Public API barrel
├── components/           # Presentational UI only
│   └── index.ts
├── hooks/                # Client-side state and effects
│   └── index.ts
├── services/             # Business logic, Supabase, server actions callers
│   └── index.ts
└── types/                # Domain types and view models
    └── index.ts
```

### Layer rules

| Layer | Allowed | Not allowed |
|---|---|---|
| **components** | Props in, JSX out, styling | Direct Supabase calls, business rules |
| **hooks** | UI state, `useTransition`, form wiring | Database queries |
| **services** | Supabase, validation, orchestration | JSX |
| **types** | Interfaces, enums, view models | Runtime logic |

Optional folders (existing code may still use these until migrated):

- `actions/` — Next.js server actions
- `lib/` — Pure helpers, page loaders, config
- `schemas/` — Zod validation

## Current Folder Tree

```
src/features/
├── ARCHITECTURE.md
├── index.ts
│
├── auth/                    ✅ complete
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── types/
│   ├── actions/
│   ├── lib/
│   └── schemas/
│
├── dashboard/               ✅ complete
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── types/
│   ├── lib/
│   └── schemas/
│
├── exercise/                🆕 scaffold (target)
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── types/
│
├── exercises/               ⚠️ legacy — migrate → exercise/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── types/
│   ├── actions/
│   └── lib/
│
├── profile/                 ✅ complete
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── types/
│   └── lib/
│
├── progress/                🆕 scaffold
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── types/
│
├── recommendation/          🆕 scaffold
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── types/
│
├── diagnostics/             🆕 scaffold
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── types/
│
├── course/                  🆕 scaffold
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── types/
│
├── assessment/              ⚠️ legacy — migrate → diagnostics/
└── onboarding/            ⚠️ legacy — migrate → profile/ or course/
```

## Migration Map (future, no pages changed yet)

| Current location | Target feature |
|---|---|
| `features/exercises/*` | `features/exercise/*` |
| `features/assessment/*` | `features/diagnostics/*` |
| `features/dashboard/lib/compute-dashboard.ts` | `features/progress/services/` |
| `features/dashboard/lib/exercise-display.ts` | `features/course/lib/` or `course/services/` |
| `features/dashboard/components/CourseSection*` | `features/course/components/` |
| `types/database.course.ts` | `features/course/types/` |

## Import Convention

```ts
// Prefer feature namespace
import { dashboard } from "@/features";

// Or direct path
import { DashboardView } from "@/features/dashboard/components";
import { DashboardService } from "@/features/dashboard/services";
```

Pages should remain thin: load data via services, render feature components.
