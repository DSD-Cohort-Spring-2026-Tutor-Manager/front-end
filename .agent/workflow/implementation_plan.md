# Tutortoise — Frontend Implementation Plan

> **Storage Rule Applied:** Frontend-specific → `/front-end/.agent/`
>
> For project-wide standards and task phasing, see `/back-end/.agent/`

---

## Actual Folder Structure vs. Recommended Target

```diff
 front-end/
 ├── app/
 │   ├── _api/
-│   │   ├── login/routes.ts          ← Still present — unclear purpose; review and remove or move to _api/auth/authClient.ts
 │   │   └── tutortoiseClient.ts      ← Keep ✅ — refactored to use lib/axios.ts
 │   ├── _components/
 │   │   ├── Alert/
 │   │   ├── CreditContext/           ← Keep
 │   │   ├── CreditOpts/             ← Keep
 │   │   ├── CreditsViewbar/         ← Keep
 │   │   ├── DataBox/                ← Keep (3 variants: Databox, DataboxMed, DataContainer)
 │   │   ├── DataBoxGrid/            ← Keep
 │   │   ├── DataTable/              ← Keep (has Admin/ and AvailableSessionsTable/ sub-dirs)
 │   │   ├── Modal/                  ← Keep
+│   │   ├── ProtectedRoute/         ← NEW: route guard component (not yet built)
+│   │   ├── ProgressChart/          ← NEW: recharts-based progress visualization (not yet built)
 │   │   ├── SideNav/                ← Keep
 │   │   └── TopNav/                 ← Keep
 │   ├── admin/                      ← Keep structure
+│   │   ├── reports/page.tsx        ← NEW: manager reporting page (not yet built)
 │   ├── parent/                     ← Keep structure
+│   │   ├── progress/page.tsx       ← NEW: ROI progress dashboard (not yet built)
 │   ├── tutor/                      ← Keep structure
+│   │   ├── notes/page.tsx          ← NEW: session notes management (not yet built)
 │   ├── context/
 │   │   ├── AuthContext.tsx          ← Refactored ✅ — sources from Zustand, no fake auth
 │   │   └── StudentContext.tsx       ← REFACTOR: remove hardcoded default, load from API
 │   ├── theme/                      ← Keep as-is (well-built)
+│   ├── types/                      ← NEW: shared TypeScript interfaces (not yet built)
+│   │   ├── session.ts
+│   │   ├── student.ts
+│   │   ├── credit.ts
+│   │   └── user.ts
 │   ├── globals.css                 ← Keep
 │   ├── layout.tsx                  ← Keep
 │   └── page.tsx                    ← Connected to backend auth ✅
+├── lib/
+│   ├── axios.ts                    ← Shared axios instance with JWT interceptor ✅
+│   └── authService.ts              ← login/logout against real backend ✅
+├── store/
+│   └── authStore.ts                ← Zustand auth store (user, role, token, isAuthenticated) ✅
+├── hooks/                          ← Exists at root (not app/hooks/)
+│   └── useRole.ts                  ← ✅ built
 ├── proxy.ts                        ← Keep (Next.js 16 proxy convention — see maintenance_log.md)
```

---

## MUI Theme

**Current state:** ✅ Well-implemented
- `Theme.ts` (257 lines) — comprehensive `createTheme` with custom palette, typography, and extensive component overrides.
- `Tokens.ts` — design tokens feeding into both MUI theme and CSS custom properties.
- `ThemeProvider.tsx` — wraps the app in MUI's `ThemeProvider`.

**Recommendations:**
- Add dark mode support to `Tokens.ts` and `Theme.ts` (Phase 2+ feature).
- Add chart color tokens for the progress dashboard (Phase 4).

---

## Component Map

| Component | MVP Feature Served | Status |
|-----------|-------------------|--------|
| `Alert/Alert.tsx` | General UX | ✅ Complete |
| `CreditContext/CreditContext.tsx` + `CreditProvider.tsx` | Credit Block System | ✅ Functional — needs auth integration |
| `CreditOpts/CreditOpts.tsx` | Credit Block System | ✅ Functional |
| `CreditsViewbar/CreditsViewBar.tsx` | Credit Block System | ✅ Functional |
| `DataBox/Databox.tsx` + `DataboxMed.tsx` + `DataContainer.tsx` | All Dashboards | ✅ Functional |
| `DataBoxGrid/DataBoxGrid.tsx` | All Dashboards | ✅ Functional |
| `DataTable/DataTable.tsx` + `TablePanel.tsx` | Session Mgmt, Admin | ✅ Functional |
| `DataTable/Admin/DataTable.tsx` + `TablePanel.tsx` | Admin Dashboard | ✅ Functional |
| `DataTable/AvailableSessionsTable/` | Session Booking | ✅ Functional |
| `Modal/Modal.tsx` + `ModalContext.tsx` | Add Student | ✅ Functional |
| `SideNav/SideNav.tsx` | Navigation | ✅ Functional |
| `TopNav/TopNav.tsx` + `TopNavWrapper.tsx` | Navigation | ✅ Functional |

**Missing Components (per MVP Phase):**

| Phase | Component | Suggested Path | Purpose |
|-------|-----------|---------------|---------|
| 0 | ProtectedRoute | `_components/ProtectedRoute/ProtectedRoute.tsx` | Route guard for authenticated pages |
| 1 | CreditPackageCard | `_components/CreditPackage/CreditPackageCard.tsx` | Display purchasable credit bundles |
| 3 | SessionNoteEditor | `_components/SessionNotes/SessionNoteEditor.tsx` | Structured note form for tutors |
| 3 | SessionNoteHistory | `_components/SessionNotes/SessionNoteHistory.tsx` | Scrollable history of past notes |
| 4 | ProgressChart | `_components/ProgressChart/ProgressChart.tsx` | Line chart for score trends |
| 4 | GoalTracker | `_components/GoalTracker/GoalTracker.tsx` | Goal vs. actual visualization |
| 5 | ReportCard | `_components/Reports/ReportCard.tsx` | Summary card for reporting metrics |
| 5 | RevenueChart | `_components/Reports/RevenueChart.tsx` | Revenue over time visualization |

---

## State Management

**Current state:** React Context API + Zustand
- `AuthContext` — **Refactored.** Now derives from `store/authStore.ts` (Zustand + persist). JWT token and role live in memory/Zustand only. No localStorage fake-auth. `lib/authService.ts` handles real login against the backend.
- `ParentContext` — **Active.** `ParentProvider` fetches `GET /api/parent/{id}` on mount (using `userId` from Zustand) and populates `parentDetails` with `creditBalance`, `students[]`, and all `Parent` base fields. This is the source of truth for credit balance and the available student list across all `/parent` pages. See `.agent/context/frontend-agent/PARENT_CONTEXT_IMPLEMENTATION.md`.
- `StudentContext` — still stores selected student with **hardcoded default** `{ studentName: "Zayn", studentId: 7 }`. The student list is now available via `ParentContext.parentDetails.students` — this context should be migrated to use `parentDetails.selectedStudent` and then removed from the `/parent` route.
- `CreditContext` — manages credit display state. The parent credit balance is now also owned by `ParentContext.parentDetails.creditBalance`. These two must be kept in sync or `CreditContext` removed from the `/parent` route in favour of `ParentContext`.

**Remaining:**
1. Migrate `selectedStudent` from `StudentContext` to `parentDetails.selectedStudent` in `ParentContext` so all `/parent` pages react to the same student selection from one place.
2. Parameterise `bookSession` — pass `parentDetails.parentId` and `parentDetails.selectedStudent.studentId` instead of hardcoded `1, 1`.
3. Resolve the dual credit balance — `CreditContext` and `ParentContext` both hold a balance; normalise to `ParentContext` within the `/parent` route.
4. Consider adding a `SessionContext` if session state becomes shared across many components.

---

## API Client

**Current state:** `tutortoiseClient.ts` — axios-based via `lib/axios.ts`. The axios instance has a Bearer token interceptor (reads from Zustand store) and a 403 → `/unauthorized` redirect. Auth headers are sent with every request.

**Remaining problems:**
1. Every method swallows errors with `console.error` — failures are invisible to callers and the UI
2. Response types are `any` everywhere — no TypeScript safety
3. `getAllSessions()` and `getOpenSessions()` hit different endpoints (`/api/sessions` vs `/api/sessions/open`) — confirm whether both are needed or consolidate
4. Some calls still hardcode `parentId` values
5. `app/_api/login/routes.ts` still exists with unclear purpose — should be reviewed and either removed or moved to `_api/auth/authClient.ts`

**`lib/axios.ts`** is the shared instance — do not create a second axios instance. Extend interceptors there if needed.

---

## Auth Implementation Notes

**Current state:** Real auth implemented.
- ✅ `POST /api/login` called from `lib/authService.ts` — returns JWT token and role
- ✅ Token stored in Zustand (`store/authStore.ts`) via `persist` middleware
- ✅ `AuthContext` refactored — sources from Zustand, exposes `user`, `setUser` (logout path calls `lib/authService.logout()`)
- ✅ `lib/axios.ts` attaches Bearer token to all requests via interceptor

**Remaining:**
- ❌ `proxy.ts` — extend with JWT token validation before allowing access to role routes
- ❌ `ProtectedRoute` component — wraps role layouts, redirects to `/` if unauthenticated (see Component Map)

---

## Per-Feature Implementation Notes

### Feature 1: Credit Block System
- Refactor `CreditOpts` to display predefined credit packages instead of arbitrary amounts
- Add transaction history page at `/parent/credits/page.tsx` (may already exist — verify content)
- Wire `CreditProvider` to the authenticated parent's actual balance

### Feature 2: Session Management
- Enhance `AvailableSessionsTable` to show subject and tutor info
- Add session detail modal with booking confirmation
- Add session status badges (color-coded: open=blue, scheduled=green, completed=gray, cancelled=red)

### Feature 3: Session Continuity Notes
- New page at `/tutor/notes/page.tsx` or inline within session detail view
- `SessionNoteEditor` with fields: topic, engagement level, difficulty areas, next steps
- `SessionNoteHistory` showing chronological notes for the selected student

### Feature 4: ROI Progress Dashboard
- New page at `/parent/progress/page.tsx`
- Install `recharts` (or `chart.js` + `react-chartjs-2`)
- `ProgressChart` renders score trends per subject over time
- `GoalTracker` shows current score vs. goal with progress ring

### Feature 5: Manager Reporting
- Expand `/admin` with dedicated reports page
- Add date range picker for filtering
- Revenue chart, LTV table, tutor utilization metrics
- CSV export button
