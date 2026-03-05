# TutorNotes Feature — Frontend Context

Last updated: 2026-03-04

## Purpose

This document captures the frontend implementation details, constraints, and next steps for the Tutor Notes feature (MVP). It exists as a single-source contextual reference for future work, QA, and handoffs.

## MVP Scope (Frontend-only)

- Tutors can view and edit a single persistent note per student (not tied to a session).
- The notes panel surfaces only students that are associated with the tutor. By default the UI shows all the tutor's students and visually marks which students have an active booked session.
- The view includes a toggle to filter to "booked only" students (to respect the original ticket scoping rule while preserving tutor workflow).
- No backend schema or endpoint changes are proposed here — frontend consumes existing endpoints and handles missing data defensively.

## Files Added

- `app/tutor/notes/page.tsx` — Main notes page, search, toggle, stats, and orchestration.
- `app/tutor/notes/notes.css` — Page-level styling (responsive, accessible).
- `app/_components/StudentNotesList/StudentNotesList.tsx` — Student list UI (badges, previews, empty state, loading state).
- `app/_components/StudentNotesList/StudentNotesList.css` — Styles for list.
- `app/_components/StudentNoteModal/StudentNoteModal.tsx` — Modal wrapper for editing notes (ARIA dialog).
- `app/_components/StudentNoteModal/StudentNoteModal.css` — Modal styling and responsive bottom-sheet behavior.
- (Reused) `app/_components/StudentNotePanel/StudentNotePanel.tsx` — existing note editor panel used inside modal.

## API Client Changes (Frontend)

- `app/_api/tutortoiseClient.ts` — added lightweight helper wrappers (defensive fetch):
  - `getStudentNote(tutorId, studentId)` — GET `/api/students/{studentId}/notes` (used to populate editor)
  - `updateStudentNote(tutorId, studentId, notes)` — PUT `/api/students/{studentId}/notes` (save)
  - `getTutorStudents(tutorId)` — GET `/api/tutor/{tutorId}/students` (preferred), with fallback derivation from sessions via existing `getSessionHistory()` if the tutor-students endpoint returns empty or fails.

Notes on API usage:

- Frontend is defensive: if student records or session payloads are missing `studentId`, those entries are ignored for the booked-students calculation and not surfaced in the booked-only list.
- The frontend expects the backend to return `id`, `firstName`, `lastName`, and optionally `notes` and a last-updated timestamp if available. If timestamps are missing, UI shows no "last updated" line.

## UX & Accessibility Highlights

- One-note-per-student is the MVP decision; the UI shows the note and a last-updated timestamp when provided.
- Booking scoping: default view shows all tutor students; a toggle allows hiding unbooked students (addresses ticket requirement while avoiding tutor workflow friction).
- Student rows are keyboard-interactive (Enter/Space opens modal). Modal uses `role="dialog"` and `aria-modal="true"`.
- Color tokens, spacing, and radii follow `app/theme/Tokens.ts` and `.agent/styling_guidelines.md` (no hard-coded hex usage in new files; CSS variables used for colors and borders).

## Edge Cases & Frontend Defensive Behaviors

- If a session object lacks a `studentId` or `studentName`, it's ignored when deriving students from sessions.
- If `getTutorStudents()` fails or returns an empty array, the page derives student list from `getSessionHistory()` to avoid an empty UI.
- If a student loses an active booking after the page loads (cancellation), the note editor remains accessible; saving will still call `updateStudentNote()` and the frontend will update the local timestamp. Backend validation/authorization is out-of-scope for this frontend change.

## Styling & Components Compliance

- All new components use CSS variables (`var(--*)`) and the brand radii (28px) per styling guidelines.
- Buttons and focus styles include the required focus-visible outlines.
- Modal follows the design system modal specs including overlay, shadow, and responsive bottom-sheet for mobile.

## Business & Product Notes

- This frontend change implements the ticket while balancing tutor usability: the booked-only restriction is available but not enforced by default.
- Admins and product managers should be aware that one-note-per-student creates attribution ambiguity; consider adding edit metadata or versioned history post-MVP.

## Tests & Next Steps

- Add component tests for: StudentNotesList (empty/loading/search), StudentNoteModal open/save flow, and API client mocks.
- Add an integration smoke test exercising the page route `/tutor/notes` (mocking API responses).
- Consider adding explicit `lastEditedBy` and `lastEditedAt` metadata to the note DTO (backend change) for auditability (post-MVP).

## Quick Dev Notes

- To preview the page locally:

```
cd front-end
npm run dev
# open http://localhost:3000/tutor/notes (auth stub may be required)
```

- The feature integrates with existing `AuthContext` and `useAuthStore` for `tutorId`. If `user.id` is a string, the page coerces to number before API calls.

---

Maintainer: Frontend Team — record any future changes in this same file.
