# ParentContext — Feature Context

## Architecture & Data Flow

`ParentContext` (`app/context/ParentContext.tsx`) is the single source of truth for all parent-scoped data across the `/parent` route subtree. It is provided by `ParentProvider`, which is mounted in `app/parent/layout.tsx`.

On mount, `ParentProvider` reads `userId` from `useAuthStore` (Zustand) and calls `TutortoiseClient.getParentDetails(parentId)` → `GET /api/parent/{id}`. The response (`ParentDTO`) is merged into `parentDetails` state via `setParentDetails`. This populates:

- `creditBalance` — the parent's live credit balance, used by all `/parent` pages and `CreditsViewBar`.
- `students` — the full list of students belonging to this parent, used to populate the student selector dropdown on the dashboard.
- All `Parent` base fields: `parentId`, `parentName`, `parentEmail`, `sessionCount`.

`ParentDetails` type (`app/context/ParentContext.tsx`):
```ts
type ParentDetails = Partial<Parent> & {
  creditBalance: number;      // live balance from API
  students: Student[];        // student list from API — drives the dropdown on /parent dashboard
  selectedStudent?: Student | null; // globally selected student (set on the dashboard)
}
```
All types (`Parent`, `Student`, `Session`) are defined in `app/types/types.ts` — import from there, do not redefine locally.

`addCredits(amount: number)` is exposed on the context value and updates `creditBalance` relatively (e.g., `addCredits(-1)` deducts 1 credit after a session booking). **Do not use the standalone `CreditContext.addCredits` for this** — `ParentContext` owns the balance.

## Consumer Pages

| Page | What it reads from `parentDetails` |
|------|-------------------------------------|
| `app/parent/page.tsx` | `creditBalance`, `students` (dropdown), `selectedStudent` |
| `app/parent/credits/page.tsx` | `creditBalance`, `parentId`, `setParentDetails` |
| `app/parent/tutoring/page.tsx` | `parentId`, `selectedStudent` |

## Design Decisions

1. **`ParentContext` owns `creditBalance` and `students`** — previously these were fetched independently per page. Centralising in `ParentProvider` means one API call on layout mount populates data for all child pages without duplication.
2. **`selectedStudent` lives on `parentDetails`** rather than in a separate `StudentContext` because it is inherently derived from the parent's student list. Keeping it co-located avoids two contexts needing to stay in sync.
3. **`ParentProvider` position in layout** — placed between `CreditProvider` and `StudentProvider` in `app/parent/layout.tsx` to preserve existing credit/student provider order while injecting parent state.

## TODOs & Backlog

- **[DONE — March 6, 2026] Wire `selectedStudent` to the dashboard dropdown** — `app/parent/page.tsx` now reads `parentDetails.selectedStudent` and `parentDetails.students` from `ParentContext` exclusively. The dropdown is built from the live `students[]` array; `dropdownOnChange` resolves the full `Student` object via `.find()` and calls `setParentDetails`. An auto-init `useEffect` selects `students[0]` on first load.
- **[DONE — March 6, 2026] Remove `StudentContext` dependency from `/parent` pages** — `StudentContext` and `StudentProvider` are no longer imported anywhere under `/parent`. `app/parent/layout.tsx` no longer mounts `StudentProvider`. `app/context/StudentContext.tsx` is retained with a `@deprecated` JSDoc notice pointing to `ParentContext.selectedStudent`.
- **[TODO] Parameterise `bookSession`** — `parentDetails.parentId` is now correctly passed from `addStudent` and the balance fetch. Wire this same value into `tutoring/page.tsx` booking flow confirmation to replace any remaining hardcoded IDs.
- **[TODO] Remove `StudentContext` file entirely** — once all non-parent consumers are confirmed absent, the file can be deleted.

Date: March 5–6, 2026
