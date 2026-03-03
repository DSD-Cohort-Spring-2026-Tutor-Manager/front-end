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
-│   │   ├── login/routes.ts          ← Unclear purpose, not a proper Next.js route handler
+│   │   ├── auth/
+│   │   │   └── authClient.ts        ← Login/register/refresh API calls
 │   │   └── tutortoiseClient.ts      ← Keep, but refactor to use axios + auth interceptor
+│   │   └── axiosInstance.ts         ← NEW: shared axios instance with JWT interceptor
 │   ├── _components/
 │   │   ├── Alert/
 │   │   ├── CreditContext/           ← Keep
 │   │   ├── CreditOpts/             ← Keep
 │   │   ├── CreditsViewbar/         ← Keep
 │   │   ├── DataBox/                ← Keep (3 variants: Databox, DataboxMed, DataContainer)
 │   │   ├── DataBoxGrid/            ← Keep
 │   │   ├── DataTable/              ← Keep (has Admin/ and AvailableSessionsTable/ sub-dirs)
 │   │   ├── Modal/                  ← Keep
+│   │   ├── ProtectedRoute/         ← NEW: route guard component
+│   │   ├── ProgressChart/          ← NEW: recharts-based progress visualization
 │   │   ├── SideNav/                ← Keep
 │   │   └── TopNav/                 ← Keep
 │   ├── admin/                      ← Keep structure
+│   │   ├── reports/page.tsx        ← NEW: manager reporting page
 │   ├── parent/                     ← Keep structure
+│   │   ├── progress/page.tsx       ← NEW: ROI progress dashboard
 │   ├── tutor/                      ← Keep structure
+│   │   ├── notes/page.tsx          ← NEW: session notes management
 │   ├── context/
 │   │   ├── AuthContext.tsx          ← REFACTOR: JWT-based, not localStorage user object
 │   │   └── StudentContext.tsx       ← REFACTOR: remove hardcoded default, load from API
 │   ├── theme/                      ← Keep as-is (well-built)
+│   ├── types/                      ← NEW: shared TypeScript interfaces
+│   │   ├── session.ts
+│   │   ├── student.ts
+│   │   ├── credit.ts
+│   │   └── user.ts
+│   ├── hooks/                      ← NEW: custom hooks
+│   │   ├── useAuth.ts
+│   │   └── useApi.ts
 │   ├── globals.css                 ← Keep
 │   ├── layout.tsx                  ← Keep
 │   └── page.tsx                    ← REFACTOR: connect to backend auth endpoint
-├── proxy.ts                        ← FIX: rename function to `middleware`, fix /api/base bug
+├── middleware.ts                   ← RENAMED: proper Next.js middleware export
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

**Current state:** React Context API
- `AuthContext` — stores `{ name, avatar, role }` in `localStorage`. **Fake auth.**
- `StudentContext` — stores selected student. **Hardcoded default** `{ studentName: "Zayn", studentId: 7 }`.
- `CreditContext` — manages credit display state.

**Recommendation:** Keep React Context for now. The app is not complex enough to warrant Redux/Zustand. However:
1. `AuthContext` must be refactored to store JWT tokens, provide `isAuthenticated`, and expose `login/logout/refresh` methods.
2. `StudentContext` must load the student list from the API based on the authenticated parent's ID.
3. Consider adding a `SessionContext` if session state becomes shared across many components.

---

## API Client

**Current state:** `tutortoiseClient.ts` — 10 methods using raw `fetch()`.

**Problems:**
1. No auth headers sent with any request
2. Error handling is `console.error` + swallow
3. `getSessionHistory()` and `getAllSessions()` hit the same endpoint (duplicate)
4. Hardcoded `parentId` values in some calls
5. No request/response interceptors
6. Response types are `any` everywhere

**Recommended Pattern:**

```typescript
// app/_api/axiosInstance.ts
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor: attach JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor: handle 401, refresh token
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.response?.status === 401) {
      // Attempt token refresh
    }
    return Promise.reject(error);
  }
);

export default api;
```

> ⚠️ GAP: `axios` is not in `package.json` — must be added.

---

## Auth Implementation Notes

**Current state:** Fake. `page.tsx` (login) matches email/password against hardcoded objects and sets `localStorage`.

**What needs to be built:**
1. `POST /api/auth/login` call from frontend → returns JWT access + refresh tokens
2. Token storage in `localStorage` (or `httpOnly` cookies if SSR matters)
3. `AuthContext` refactored: `{ user, isAuthenticated, login, logout, refresh }`
4. `middleware.ts` (renamed from `proxy.ts`) — check for valid token before allowing access to role routes
5. `ProtectedRoute` component — wraps role layouts, redirects to `/` if unauthenticated

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
