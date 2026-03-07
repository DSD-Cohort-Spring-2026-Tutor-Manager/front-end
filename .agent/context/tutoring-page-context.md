# /parent/tutoring — Feature Context

## Architecture & Data Flow

`app/parent/tutoring/page.tsx` renders under the parent layout (which provides `ParentProvider` and `CreditProvider`). The page has two top-level areas:

**Navigation row (`.tutoring__nav`)**
- **Student selector** — a `<select>` driven entirely by `parentDetails.students[]` from `ParentContext`. On change, it calls `setParentDetails({ ...parentDetails, selectedStudent })` to update `parentDetails.selectedStudent` in context. No separate `StudentContext` is used on this page.
- **CreditsViewBar** — reads `credits` from `CreditContext` for the display value.

**Session table**
- `AvailableSessionsTable` — receives a `sessions` prop from `page.tsx` (no internal data source). On mount, `page.tsx` calls `TutortoiseClient.getOpenSessions()` (`GET /api/sessions/open`), maps each `SessionDTO` to `SessionRow` via `toSessionRow()`, and stores the result in local `sessions` state. A `sessionsLoading` flag suppresses the table until the fetch settles; a `sessionsError` flag surfaces a fallback message when the call fails and the list is empty.

## Book Session Flow

```
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
           addCredits(-1)         ← CreditContext (drives CreditsViewBar display)
           parentCtx.addCredits(-1) ← ParentContext (keeps creditBalance in sync)
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
| `credits` | `CreditContext` | Displayed in `CreditsViewBar` |
| `parentDetails.creditBalance` | `ParentContext` | Displayed inside the confirmation modal |

## Modal Implementation

- `Modal` is used with `buttons={[]}` (empty) and a `children` prop — the entire modal body and buttons are injected as JSX children. This avoids adding a new `type` branch to `Modal.tsx`.
- Button classes reuse `.add-student-modal-buttons`, `.modal-button`, `.add-student-confirm-button`, `.add-student-cancel-button` from `Modal.css` for visual consistency with the add-student modal.
- Title uses `.add-student-modal_header` (note: single underscore — pre-existing typo in `Modal.css`, do not replicate).

## Design Decisions

1. **`children` injection over new modal type** — keeps `Modal.tsx` clean; page controls its own layout without branching the base component.
2. **Local state for modal** — `isBookingModalOpen` and `selectedSession` are co-located in `page.tsx` rather than `ModalContext` because the selected session object is only relevant here.
3. **Dual credit deduction** — both `CreditContext.addCredits(-1)` and `ParentContext.addCredits(-1)` are called after a successful booking to keep both contexts in sync. This is a temporary workaround until `CreditContext` is removed from the `/parent` route in favour of `ParentContext` exclusively (see implementation plan).
4. **`parentId` / `studentId` resolution** — reads from `ParentContext` (not hardcoded). Falls back to `students[0]` if no explicit selection has been made, rather than failing silently.
5. **Fetch in `page.tsx`, not inside `AvailableSessionsTable`** — keeps `AvailableSessionsTable` a pure display component with no side effects, consistent with how `Databox` and `DataboxMed` are used project-wide. `page.tsx` owns loading/error state alongside the booking action that modifies it.
6. **Optimistic removal over re-fetch** — after a confirmed booking, the booked session is filtered out of local `sessions` state immediately. A just-booked session is no longer open by definition; re-fetching would add latency for zero benefit. If the API call fails, the session correctly remains visible.
7. **`toSessionRow` as a named module-level helper** — isolates `datetimeStarted` parsing from render logic; easy to update when the backend date format is confirmed. Guards missing `datetimeStarted` with `new Date(0)` fallback and missing `tutorName`/`subject` with `'—'`.

## TODOs & Backlog

- **[DONE — March 6, 2026] Wire `AvailableSessionsTable` to `GET /api/sessions/open`** — `page.tsx` now fetches `TutortoiseClient.getOpenSessions()` on mount, maps `SessionDTO[]` to `SessionRow[]` via `toSessionRow()`, and passes them as the `sessions` prop. After a successful booking, the session is removed optimistically from local state. `defaultSessions` removed from `AvailableSessionsTable`.
- **[TODO] Unified error handling on booking failure** — the modal closes silently on API error. Should surface an `Alert` or equivalent user-facing feedback consistent with the pattern used elsewhere (see `Alert` component).
- **[TODO] Remove dual credit deduction** — once `CreditContext` is retired from the `/parent` route, remove the `addCredits(-1)` call and rely solely on `parentCtx.addCredits(-1)`.
- **[TODO] Enforce credit guard before confirming** — currently there is no client-side check that `creditBalance >= 1` before calling the API. Add a guard in `handleConfirmBooking` and disable or hide the Confirm button when balance is 0.

Last updated: 2026-03-06 (API sessions wired; optimistic removal added)
