```markdown
# Tutortoise — API Contracts

> **Source of truth:** `../back-end/src/main/java/org/tutortoise/service/`
> **Last audited:** 2026-03-06 — verified by reading all Controller, DTO, and Request/Response classes directly.
> **Base URL (proxied):** All calls go through `proxy.ts` → `https://back-end-main.onrender.com`
> **Frontend client:** `app/_api/tutortoiseClient.ts`
> **Auth:** Bearer JWT token attached to every request via the interceptor in `lib/axios.ts`.

---

## Status Key

| Symbol | Meaning |
|--------|---------|
| ✅ | Implemented in `tutortoiseClient.ts` |
| ❌ | Exists in backend — not yet called from the frontend |
| ⚠️ | Implemented but has a known issue |

---

## Authentication — `/api/login`

### `POST /api/login` ✅
**File:** `login/LoginController.java`

**Request body:**
```json
{
  "email": "string",
  "credentials": "string (base64 encoded 'username:password')",
  "role": "parent | tutor | admin"
}
```

**Response `200`:**
```json
{
  "userId": "integer",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "role": "string",
  "message": "string",
  "success": true
}
```

**Response `401`:**
```json
{
  "success": false,
  "message": "string (error reason)"
}
```

> **Frontend note:** Called via `lib/authService.ts`, not `tutortoiseClient.ts`. The `tt_role` cookie used by `proxy.ts` for route guarding is set separately after login.

---

## Sessions — `/api/sessions`

### `GET /api/sessions` ✅
**File:** `session/SessionController.java`
Returns all sessions regardless of tutor, parent, or status.

**Response `200` — `SessionDTO[]`:**
```json
[
  {
    "sessionId": "integer",
    "parentId": "integer | null",
    "studentId": "integer | null",
    "studentFirstName": "string | null",
    "studentLastName": "string | null",
    "notes": "string | null",
    "subject": "string",
    "tutorId": "integer",
    "tutorName": "string",
    "durationsHours": "double",
    "sessionStatus": "OPEN | SCHEDULED | COMPLETED | CANCELLED",
    "datetimeStarted": "ISO-8601 datetime",
    "assessmentPointsEarned": "double | null",
    "assessmentPointsGoal": "double | null",
    "assessmentPointsMax": "double | null"
  }
]
```

> **Frontend note:** Called by both `getAllSessions()` and `getSessionHistory()` in the client — both hit the same endpoint. Consolidation is a known TODO in the implementation plan.

---

### `GET /api/sessions/open` ✅
Returns only sessions with status `OPEN` (available for booking).

**Response `200`:** `SessionDTO[]` — same shape as above.

---

### `GET /api/sessions/tutor/{tutorId}?status={status}` ❌
**Not yet called from the frontend.**
Returns sessions filtered by tutor and optionally by status.

**Path param:** `tutorId` — positive integer
**Query param:** `status` — `OPEN | SCHEDULED | COMPLETED | CANCELLED | all`

**Response `200`:** `SessionDTO[]` — same shape as above.

> **Frontend note:** Required for the tutor dashboard/classes page (`/tutor/classes/page.tsx`). Needed when building any tutor-facing session list.

---

## Parent — `/api/parent`

### `GET /api/parent/{parentId}` ✅
Returns parent profile and their students. Pass optional `studentId` query param to filter to a single student.

**Path param:** `parentId` — positive integer
**Query param:** `studentId` — positive integer (optional)

**Response `200` — `ParentDTO`:**
```json
{
  "parentId": "integer",
  "parentName": "string",
  "parentEmail": "string",
  "sessionCount": "integer",
  "creditBalance": "double",
  "students": [
    {
      "studentId": "integer",
      "parentId": "integer",
      "studentName": "string",
      "notes": "string | null",
      "sessionsCompleted": "integer",
      "previousScore": "integer | null",
      "latestScore": "integer | null",
      "sessions": "SessionDTO[] | null",
      "subjects": "SubjectDTO[] | null"
    }
  ],
  "status": "HttpStatus",
  "operationStatus": "string",
  "message": "string"
}
```

> **TypeScript note:** The `students[].subjects[]` shape is `SubjectDTO` — see below.

---

### `GET /api/parent/{parentId}/student-scores` ❌
**Not yet called from the frontend.**
Returns parent data with each student's session list and progress scores.

**Path param:** `parentId` — positive integer

**Response `200`:** `ParentDTO` — same shape as above, with `students[].sessions` populated.

> **Frontend note:** This is the primary data source for the planned `/parent/progress` dashboard (Phase 4 in the implementation plan).

---

### `GET /api/parent/{parentId}/students-subject-progress` ❌
**Not yet called from the frontend.**
Returns per-subject progress for a parent's students. Optionally filter by student and/or subject.

**Path param:** `parentId` — positive integer
**Query params:**
- `studentId` — integer (optional)
- `subject` — integer subjectId (optional)

**Response `200`:** `ParentDTO` — same shape, with subject progress data in `students[].subjects`.

> **Frontend note:** Required for the `/parent/progress` page and the `ProgressChart` / `GoalTracker` components planned in Phase 4.

---

### `POST /api/parent/book/{sessionId}/{parentId}/{studentId}` ✅ ⚠️
Books a session for a parent/student. Deducts 1 credit from parent balance.

**Path params:** `sessionId`, `parentId`, `studentId` — all positive integers

**Response `200`:** `SessionDTO` — the updated session with parent/student assigned.

**Response `500`:** If insufficient credits or session already booked.

> ✅ `bookSession` is fully parameterized. `parentId` comes from `ParentContext.parentDetails.parentId` and `studentId` from `ParentContext.parentDetails.selectedStudent.studentId`. `StudentContext` has been deleted — `ParentContext` is the sole source of truth for all parent-flow identity data.

---

## Credits — `/api/credits`

### `GET /api/credits/balance/{parentId}` ✅
Returns the parent's current credit balance as a plain `double`.

**Response `200`:** `1.0` (plain number, not wrapped in an object)

---

### `GET /api/credits/history/{parentId}` ✅
Returns the parent's full transaction history.

**Response `200` — `CreditHistoryDTO[]`:**
```json
[
  {
    "transactionId": "integer",
    "parentId": "integer",
    "tutorId": "integer | null",
    "sessionId": "integer | null",
    "numberOfCredits": "integer",
    "transactionTotal": "double",
    "transactionType": "string (PURCHASE | DEDUCTION)",
    "transactionTime": "ISO-8601 datetime"
  }
]
```

---

### `POST /api/credits/buy` ✅
Purchase credits for a parent.

**Request body:**
```json
{
  "parentId": "integer",
  "credits": "integer",
  "amount": "double"
}
```

**Response `200` — `CreditResponseDTO`:**
```json
{
  "parentId": "integer",
  "creditsPurchased": "integer",
  "amountPaid": "double",
  "updatedBalance": "double",
  "transactionTime": "ISO-8601 datetime"
}
```

---

## Student — `/api/student`

### `POST /api/student/add` ✅
Adds a new student under a parent account.

**Request body:**
```json
{
  "parentId": "integer",
  "firstName": "string",
  "lastName": "string"
}
```

**Response `200` — `StudentDTO`:**
```json
{
  "studentId": "integer",
  "parentId": "integer",
  "studentName": "string",
  "notes": "string | null",
  "sessionsCompleted": "integer",
  "previousScore": "integer | null",
  "latestScore": "integer | null",
  "sessions": "SessionDTO[] | null",
  "subjects": "SubjectDTO[] | null"
}
```

---

### `GET /api/student/{studentId}/note?tutorId={tutorId}` ❌
**Not yet called from the frontend.**
Returns the tutor's note for a specific student.

**Path param:** `studentId` — integer
**Query param:** `tutorId` — integer

**Response `200` — `StudentNoteDTO`:**
```json
{
  "studentId": "integer",
  "firstName": "string",
  "lastName": "string",
  "notes": "string"
}
```

> **Frontend note:** Required for the `SessionNoteEditor` / `SessionNoteHistory` components planned in Phase 3 (`/tutor/notes`).

---

### `PUT /api/student/{studentId}/note?tutorId={tutorId}` ❌
**Not yet called from the frontend.**
Updates the tutor's note for a student.

**Path param:** `studentId` — integer
**Query param:** `tutorId` — integer

**Request body:**
```json
{
  "notes": "string"
}
```

**Response `200` — `StudentNoteDTO`:** same shape as GET above.

---

## Tutor — `/api/tutor`

### `PUT /api/tutor/assign-grade` ✅
Marks a session as completed and assigns an assessment grade.

**Request body:**
```json
{
  "tutorId": "integer (positive)",
  "sessionId": "integer (positive)",
  "grade": "integer (0–100)"
}
```

**Response `200` — `TutorDTO`:**
```json
{
  "tutorId": "integer",
  "sessionId": "integer",
  "studentId": "integer",
  "subjectId": "integer",
  "assessmentPointEarned": "integer",
  "dateTime": "ISO-8601 datetime",
  "duration": "integer",
  "tutorName": "string",
  "subject": "string",
  "studentName": "string",
  "notes": "string | null"
}
```

---

## Admin — `/api/admin`

### `GET /api/admin/dashboard` ✅
Returns high-level dashboard metrics and a paginated session list.

**Query params (pagination):** `page`, `size` (default 10), `sort` (default `datetimeStarted,desc`)

**Response `200` — `AdminDashboardDTO`:**
```json
{
  "weeklyCreditSold": "integer",
  "weeklySessionsBooked": "integer",
  "bookedSessions": "SessionDTO[]"
}
```

---

## Shared Type Reference

### `SubjectDTO`
```json
{
  "subjectId": "integer",
  "subjectName": "string",
  "totalSubjectHours": "integer",
  "totalSubjectHoursCompleted": "integer",
  "progressPercentage": "double"
}
```

### `StudentProgressDTO`
*(Not yet surfaced in any frontend endpoint — available in backend)*
```json
{
  "subjectId": "integer",
  "subjectName": "string",
  "totalSubjectHours": "integer",
  "subjectHoursUsed": "integer",
  "progressPercentage": "double"
}
```

---

## Unimplemented Endpoints Summary

These backend endpoints exist and are ready to call — they have no frontend implementation yet:

| Endpoint | Use Case | Implementation Plan Phase |
|----------|----------|--------------------------|
| `GET /api/sessions/tutor/{tutorId}?status=` | Tutor session list / classes page | Phase 2 |
| `GET /api/parent/{parentId}/student-scores` | Parent progress dashboard | Phase 4 |
| `GET /api/parent/{parentId}/students-subject-progress` | Per-subject progress charts | Phase 4 |
| `GET /api/student/{studentId}/note` | Tutor reads student note | Phase 3 |
| `PUT /api/student/{studentId}/note` | Tutor writes student note | Phase 3 |
```
