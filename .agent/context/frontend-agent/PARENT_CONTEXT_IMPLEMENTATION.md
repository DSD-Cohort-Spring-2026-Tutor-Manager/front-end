# ParentContext — Feature Context

## Architecture & Data Flow

`ParentContext` (`app/context/ParentContext.tsx`) is the single source of truth for all parent-scoped data across the `/parent` route subtree. It is provided by `ParentProvider`, which is mounted in `app/parent/layout.tsx`.

`ParentProvider` reads `userId` from `useAuthStore` (Zustand) and calls `TutortoiseClient.getParentDetails(parentId)` → `GET /api/parent/{id}`. The fetch effect depends on **both `userId` and `pathname`** (from `usePathname`) — this means the API is re-called on every client-side navigation within `/parent/*` as well as on a hard browser refresh. The response (`ParentDTO`) is merged into `parentDetails` state via `setParentDetails((prev) => ({ ...prev, ...data }))`, preserving frontend-only fields like `selectedStudent` across navigations. This populates:

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

`addCredits(amount: number)` is exposed on the context value and updates `creditBalance` relatively (e.g., `addCredits(-1)` deducts 1 credit after a session booking). **`CreditContext` has been fully removed from the `/parent` route** — `ParentContext` is the sole owner of `creditBalance` across all `/parent` pages. `CreditProvider` is no longer mounted in `app/parent/layout.tsx`.

## Consumer Pages

| Page | What it reads from `parentDetails` |
|------|-------------------------------------|
| `app/parent/page.tsx` | `creditBalance`, `students` (dropdown), `selectedStudent` |
| `app/parent/credits/page.tsx` | `creditBalance`, `parentId`, `setParentDetails` |
| `app/parent/tutoring/page.tsx` | `parentId`, `selectedStudent` |

## Design Decisions

1. **`ParentContext` owns `creditBalance` and `students`** — previously these were fetched independently per page. Centralising in `ParentProvider` means one API call per navigation populates data for all child pages without duplication. `CreditContext` and `CreditProvider` have been fully removed from the `/parent` layout.
2. **`selectedStudent` lives on `parentDetails`** rather than in a separate `StudentContext` because it is inherently derived from the parent's student list. Keeping it co-located avoids two contexts needing to stay in sync.
3. **`ParentProvider` is the sole provider in `app/parent/layout.tsx`** — `CreditProvider` and `StudentProvider` have both been removed. The layout now simply wraps children in `<ParentProvider>`.
4. **Pathname-triggered re-fetch** — `usePathname` is added as a dependency of the fetch `useEffect`. Since `ParentProvider` stays mounted across client-side navigations within the layout, this ensures a fresh `GET /api/parent/{id}` is made every time the user navigates to any `/parent/*` page, keeping credit balance and student list always current. The spread merge `{ ...prev, ...data }` preserves `selectedStudent` (frontend-only, not in API response) across re-fetches.

## TODOs & Backlog

- **[DONE — March 6, 2026] Wire `selectedStudent` to the dashboard dropdown** — `app/parent/page.tsx` now reads `parentDetails.selectedStudent` and `parentDetails.students` from `ParentContext` exclusively. The dropdown is built from the live `students[]` array; `dropdownOnChange` resolves the full `Student` object via `.find()` and calls `setParentDetails`. An auto-init `useEffect` selects `students[0]` on first load.
- **[DONE — March 6, 2026] Remove `StudentContext` dependency from `/parent` pages** — `StudentContext` and `StudentProvider` are no longer imported anywhere under `/parent`. `app/parent/layout.tsx` no longer mounts `StudentProvider`. `app/context/StudentContext.tsx` is retained with a `@deprecated` JSDoc notice pointing to `ParentContext.selectedStudent`.
- **[DONE — March 6, 2026] Remove `CreditContext` from `/parent` route** — `CreditProvider` removed from `app/parent/layout.tsx`. All three pages (`page.tsx`, `tutoring/page.tsx`, `credits/page.tsx`) read balance exclusively from `parentDetails.creditBalance`. `addCredits` calls now target `parentCtx.addCredits` only.
- **[DONE — March 6, 2026] Pathname-triggered refresh** — `usePathname` added to the `ParentProvider` fetch effect dependency array so `GET /api/parent/{id}` is called on every `/parent/*` navigation, not just on first mount.
- **[TODO] Parameterise `bookSession`** — `parentDetails.parentId` is now correctly passed from `addStudent`. Wire this same value into `tutoring/page.tsx` booking flow to replace any remaining hardcoded IDs.
- **[TODO] Remove `StudentContext` file entirely** — once all non-parent consumers are confirmed absent, the file can be deleted.

Date: March 5–6, 2026
