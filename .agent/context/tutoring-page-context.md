# /parent/tutoring — Feature Context

## Architecture & Data Flow

`app/parent/tutoring/page.tsx` renders under the parent layout (which provides only `ParentProvider` — `CreditProvider` is not present in the parent layout). The page has two top-level areas:

**Navigation row (`.tutoring__nav`)**
- **Student selector** — a `<select>` driven entirely by `parentDetails.students[]` from `ParentContext`. On change, it calls `setParentDetails({ ...parentDetails, selectedStudent })` to update `parentDetails.selectedStudent` in context. No separate `StudentContext` is used on this page.
- **CreditsViewBar** — reads `parentDetails.creditBalance` from `ParentContext` (`parentDetails.creditBalance.toString()`) for the display value.

**Session table**
- `AvailableSessionsTable` — receives a `sessions` prop from `page.tsx` (no internal data source). On mount, `page.tsx` calls `TutortoiseClient.getOpenSessions()` (`GET /api/sessions/open`), maps each `SessionDTO` to `SessionRow` via `toSessionRow()`, and stores the result in local `sessions` state. `AvailableSessionsTable` renders **only** when `!sessionsLoading && !sessionsError && sessions.length > 0`; this prevents an empty header-only table from mounting under status messages.
- **Status messages** — three mutually exclusive `<p>` elements cover the other states: loading spinner text (`.tutoring__status`), error fallback (`.tutoring__status tutoring__status--error`), and no-sessions empty state (`.tutoring__status`). Styles defined in `tutoring.css`: `margin-top: 2.5rem`, `font-size: 1.25rem`, `font-weight: 700`; error variant uses `color: var(--color-error)`.

## Book Session Flow

```text
user clicks "Join" on a row
  → handleJoinClick(session: SessionRow)
    → setSelectedSession(session)
    → setIsBookingModalOpen(true)

Modal renders with session details + available credit balance
  → user clicks "Confirm"
    → handleConfirmBooking()
      → reads parentDetails.parentId
      → reads parentDetails.selectedStudent?.studentId
           (falls back to parentDetails.students[0].studentId if no explicit selection)
      → guards: if either ID is missing, logs error and returns (modal stays open)
      → await TutortoiseClient.bookSession(parentId, studentId, sessionId)
           POST /api/parent/book/{sessionId}/{parentId}/{studentId}
      → on success:
           parentCtx.addCredits(-1) ← ParentContext (decrements parentDetails.creditBalance; drives CreditsViewBar display)
           setSessions(prev => prev.filter(s => s.id !== selectedSession.id))  ← optimistic removal
      → on error: console.error (modal closes silently — known gap)
      → finally: closeBookingModal() — always closes regardless of outcome

  → user clicks "Cancel" → closeBookingModal()
```

## State

| State | Location | Purpose |
|-------|----------|---------|
| `sessions` | local `useState` in `page.tsx` | Live list of open sessions from `GET /api/sessions/open`, mapped to `SessionRow[]` |
| `sessionsLoading` | local `useState` in `page.tsx` | `true` until the open-sessions fetch settles; suppresses table render |
| `sessionsError` | local `useState` in `page.tsx` | `true` if the fetch throws; triggers fallback message when list is empty |
| `isBookingModalOpen` | local `useState` in `page.tsx` | Controls modal visibility |
| `selectedSession` | local `useState` in `page.tsx` | Holds the `SessionRow` being confirmed |
| `parentDetails.selectedStudent` | `ParentContext` | Determines the `studentId` sent to the booking API |
| `parentDetails.students[]` | `ParentContext` | Populates the student dropdown |
| `parentDetails.creditBalance` | `ParentContext` | Displayed in `CreditsViewBar` and inside the confirmation modal |

## Modal Implementation

- `Modal` is used with `buttons={[]}` (empty) and a `children` prop — the entire modal body and buttons are injected as JSX children. This avoids adding a new `type` branch to `Modal.tsx`.
- Button classes reuse `.add-student-modal-buttons`, `.modal-button`, `.add-student-confirm-button`, `.add-student-cancel-button` from `Modal.css` for visual consistency with the add-student modal.
- Title uses `.add-student-modal_header` (note: single underscore — pre-existing typo in `Modal.css`, do not replicate).

## Design Decisions

1. **`children` injection over new modal type** — keeps `Modal.tsx` clean; page controls its own layout without branching the base component.
2. **Local state for modal** — `isBookingModalOpen` and `selectedSession` are co-located in `page.tsx` rather than `ModalContext` because the selected session object is only relevant here.
3. **Single credit deduction via `ParentContext`** — only `parentCtx.addCredits(-1)` is called after a successful booking. This updates `parentDetails.creditBalance` in `ParentContext`, which is the sole credit source for both `CreditsViewBar` and the confirmation modal. `CreditContext` is not present in the `/parent` route.
4. **`parentId` / `studentId` resolution** — reads from `ParentContext` (not hardcoded). Falls back to `students[0]` if no explicit selection has been made, rather than failing silently.
5. **Fetch in `page.tsx`, not inside `AvailableSessionsTable`** — keeps `AvailableSessionsTable` a pure display component with no side effects, consistent with how `Databox` and `DataboxMed` are used project-wide. `page.tsx` owns loading/error state alongside the booking action that modifies it.
6. **Optimistic removal over re-fetch** — after a confirmed booking, the booked session is filtered out of local `sessions` state immediately. A just-booked session is no longer open by definition; re-fetching would add latency for zero benefit. If the API call fails, the session correctly remains visible.
7. **`toSessionRow` as a named module-level helper** — isolates `datetimeStarted` parsing from render logic; easy to update when the backend date format is confirmed. Guards missing `datetimeStarted` by assigning `null` (renders `'—'` for both date and time fields); missing `tutorName`/`subject` also fall back to `'—'`.

## TODOs & Backlog

- **[DONE — March 6, 2026] Wire `AvailableSessionsTable` to `GET /api/sessions/open`** — `page.tsx` now fetches `TutortoiseClient.getOpenSessions()` on mount, maps `SessionDTO[]` to `SessionRow[]` via `toSessionRow()`, and passes them as the `sessions` prop. After a successful booking, the session is removed optimistically from local state. `defaultSessions` removed from `AvailableSessionsTable`.
- **[DONE — March 6, 2026] Fix `AvailableSessionsTable` render guard** — the previous guard (`!sessionsLoading`) caused the table to mount even during error or empty-list states, producing a header-only table under status messages. Condition tightened to `!sessionsLoading && !sessionsError && sessions.length > 0`.
- **[DONE — March 6, 2026] Add `.tutoring__status` CSS** — defined in `tutoring.css`; gives loading/error/empty-state messages `margin-top: 2.5rem`, `font-size: 1.25rem`, `font-weight: 700`. Error modifier uses `var(--color-error)` per styling guidelines.
- **[TODO] Unified error handling on booking failure** — the modal closes silently on API error. Should surface an `Alert` or equivalent user-facing feedback consistent with the pattern used elsewhere (see `Alert` component).
- **[DONE — March 6, 2026] Remove dual credit deduction** — `CreditContext` has been fully removed from the `/parent` route. Only `parentCtx.addCredits(-1)` (via `ParentContext`) is called after a successful booking.
- **[TODO] Enforce credit guard before confirming** — currently there is no client-side check that `creditBalance >= 1` before calling the API. Add a guard in `handleConfirmBooking` and disable or hide the Confirm button when balance is 0.

Last updated: 2026-03-06 (API sessions wired; optimistic removal added; render guard tightened; status message CSS added)
