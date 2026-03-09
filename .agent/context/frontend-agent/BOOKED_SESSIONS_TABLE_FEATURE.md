# Booked Sessions Table — Feature Context

## Purpose

Parents need visibility into which tutoring sessions have been booked for their currently selected student, directly from the dashboard. Before this feature the dashboard only showed completed session counts and score data — a parent had no way to see upcoming scheduled sessions without navigating elsewhere.

## Files Created

### `app/_components/DataTable/BookedSessionsTable/BookedSessionsTable.tsx`

A presentational table component that displays booked sessions for a student on the parent dashboard.

**Why a new component instead of reusing `AvailableSessionsTable`?**
`AvailableSessionsTable` is purpose-built for the tutoring route — it has a "Join" action column and is titled "Available Tutoring Sessions". The booked table has different concerns: no action column (backend has no cancel endpoint), different title ("Tutoring Schedule"), a "Find a tutor" navigation button, and "View More" pagination. Creating a separate component avoids polluting `AvailableSessionsTable` with conditional logic that would make both harder to maintain.

**Why follow the same `SessionRow` shape?**
The `SessionRow` type (`id`, `date`, `tutor`, `subject`, `time`) is reused from the tutoring page pattern. This keeps the data contract consistent — the parent page's `toSessionRow()` mapper produces the same shape, and if the two tables ever need to share logic it's already compatible.

**Why these 4 columns (Date, Tutor, Subject, Time)?**
These are the fields actionable to a parent viewing their child's schedule. Fields like `sessionId`, `assessmentPointsEarned/Goal/Max`, `durationHours`, and `notes` are either internal, tutor-facing, or only relevant after session completion — they would add noise without value.

**Props:**

- `sessions` — array of `SessionRow` objects to display.
- `loading` — when `true`, renders a `CircularProgress` spinner instead of the empty state or rows. This prevents flashing "No sessions booked." while the API call is in-flight.
- `onFindTutor` — callback for the "Find a tutor" button. The parent page binds this to `router.push('/parent/tutoring')`.

**Pagination ("View More"):**

- Starts showing 5 rows (`INITIAL_VISIBLE = 5`), increments by 10 (`PAGE_SIZE = 10`) on each click.
- The "View More" button is hidden when `visibleCount >= sessions.length`.
- Why 5 initial? Matches the mockup density without overwhelming the dashboard. Why increment by 10? Matches the requirement spec.

**Loading state:**
Uses MUI `CircularProgress` with `color='success'` and a "Loading sessions…" `Typography`, matching the pattern from `app/parent/student/page.tsx`. This was added because without it, the table would flash "No sessions booked." during the initial fetch, which is misleading — the parent might think their student genuinely has no sessions when the data simply hasn't arrived yet.

**Empty state:**
When `loading` is `false` and `sessions.length === 0`, shows "No sessions booked." The table header and "Find a tutor" button remain visible so the parent always has a navigation path to book sessions.

### `app/_components/DataTable/BookedSessionsTable/BookedSessionsTable.css`

Styles using `.booked-table` BEM namespace, derived from `AvailableSessionsTable.css`.

**Why a separate namespace instead of sharing `.sessions-table`?**
The two tables coexist in the same app. Sharing class names would cause style leakage — changing one table's grid layout or colors would unintentionally affect the other.

**Key differences from `AvailableSessionsTable.css`:**

- 4-column grid (`1.1fr 2fr 2fr 1.2fr`) instead of 5 — no Options/action column.
- `.booked-table__find-btn` uses `var(--Accent)` with a pill shape — styled distinctly as a navigation CTA.
- `.booked-table__view-more-btn` uses `var(--Support)` navy background, centered below the list.
- `.booked-table__loading` provides centered flex column layout for the spinner.
- `.booked-table__labels` has `font-style: italic` to match the mockup's label styling.
- Same responsive breakpoints (768px, 600px) with the same mobile-first approach — labels hidden on small screens, `::before` pseudo-elements provide inline labels per cell.

## Files Modified

### `app/parent/page.tsx`

**New imports:**

- `useRouter` from `next/navigation` — needed to programmatically navigate to `/parent/tutoring` when "Find a tutor" is clicked.
- `BookedSessionsTable` — the new component.

**New types and helpers:**

- `SessionRow` type — flat display-ready shape with `id`, `date`, `tutor`, `subject`, `time`.
- `toSessionRow(session: Session): SessionRow` — maps a raw `Session` object into a `SessionRow`. Formats `datetimeStarted` into separate date and time strings using `toLocaleDateString` and `toLocaleTimeString`. This is the same transformation pattern used in `app/parent/tutoring/page.tsx` for consistency.

**New state:**

- `sessionsLoading` — initialized to `true`, set to `false` in the `finally` block of the session fetch `useEffect`. Drives the loading spinner in `BookedSessionsTable`.

**Why `finally` instead of setting it in both `try` and `catch`?**
`finally` guarantees `sessionsLoading` is set to `false` regardless of success or failure, avoiding duplication and ensuring the loading state always resolves.

**New derived value — `bookedSessions`:**

```ts
const bookedSessions =
  parentDetails.selectedStudent?.studentId != null
    ? sessions
        .filter(
          (s) =>
            s.sessionStatus === 'scheduled' &&
            s.studentId === parentDetails.selectedStudent?.studentId &&
            s.parentId === parentDetails.parentId,
        )
        .sort(
          (a, b) =>
            new Date(a.datetimeStarted).getTime() -
            new Date(b.datetimeStarted).getTime(),
        )
        .map(toSessionRow)
    : [];
```

**Why filter on all three conditions?**

- `sessionStatus === 'scheduled'` — excludes completed and cancelled sessions. Open/unbooked sessions also have status `'scheduled'` but won't match because they have no `studentId`/`parentId` assigned.
- `studentId === selectedStudent.studentId` — scopes to the currently selected student so the table updates when the parent switches students via the dropdown.
- `parentId === parentDetails.parentId` — ensures we only show sessions booked by _this_ parent, not sessions where the student was booked by a different parent (edge case safety).

**Why sort ascending?**
The parent's most immediate concern is "what's coming up next?" — ascending date order puts the nearest upcoming session at the top.

**Why derived inline (no `useEffect` + separate state)?**
This follows the existing pattern on this page (see `completedSess` and `latestTwo`). Derived values that are pure functions of existing state don't need their own state — they're recomputed on every render, which is cheap for the list sizes involved and avoids stale-data bugs from effect timing.

**Render placement:**
`<BookedSessionsTable>` is placed between the `dashboard__data-row` section and the `alert-layer` div. This positions the schedule table below the stat boxes but above the alert overlay, matching the mockup layout.

## What Was NOT Changed

- **No backend changes.** The backend has no cancel endpoint and the team confirmed they won't create one. The table is read-only.
- **No changes to `AvailableSessionsTable`** — it remains untouched for the tutoring route.
- **No changes to `TutortoiseClient`** — the page already calls `getAllSessions()` on mount; no new API methods were needed.
- **No changes to `ParentContext`** — `selectedStudent` and `parentId` are already available from context.
- **No changes to `dashboard.css`** — the table's top margin (`margin-top: 32px`) is scoped to `.booked-table` in the component's own CSS file.

## Data Flow

```
Page mount
  → useEffect calls TutortoiseClient.getAllSessions()  (GET /api/sessions)
  → sessionsLoading = true  →  BookedSessionsTable shows spinner
  → Response arrives  →  setSessions(allSessions), setSessionsLoading(false)
  → On every render, bookedSessions is derived by filtering sessions for:
      sessionStatus === 'scheduled'
      AND studentId === selectedStudent.studentId
      AND parentId === parentDetails.parentId
    then sorted ascending by datetimeStarted
    then mapped through toSessionRow()
  → BookedSessionsTable receives the derived array and renders rows

Student switch (via Databox dropdown)
  → setParentDetails updates selectedStudent
  → Re-render recalculates bookedSessions with new studentId filter
  → Table updates automatically — no refetch needed
```

## Edge Cases

- **No selected student yet** — `bookedSessions` defaults to `[]`, table shows empty state after loading completes.
- **API failure** — `sessionsLoading` still resolves to `false` via `finally`, table shows "No sessions booked." rather than spinning forever.
- **Sessions with null `datetimeStarted`** — `toSessionRow` handles this with fallback `'—'` values.
- **More than 5 booked sessions** — "View More" button appears, revealing 10 more per click until all are shown.
