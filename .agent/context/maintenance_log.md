# Warnings & Maintenance Log

This file tracks persistent warnings, minor maintenance items, and failed suppression attempts to group them for collective resolution.

## Persistent Warnings

### Node.js `util._extend` Deprecation (DEP0060)
- **Warning Message**: `(node:2904) [DEP0060] DeprecationWarning: The util._extend API is deprecated. Please use Object.assign() instead.`
- **Source**: Internal polyfills in `next@16.1.6`. None of the project source code uses this API.
- **Status**: Active (Information only). does not affect functionality.
- **Failed Suppression Attempt**: Adding `NODE_OPTIONS='--no-deprecation'` directly to the `dev` script in `package.json` caused the command to fail on Windows environments due to shell syntax differences.
- **Recommendation**: **Do not attempt** to suppress this inline in `package.json` without using a cross-platform tool like `cross-env`. Given it's a core dependency issue, it is best resolved by a future Next.js patch.

---

## Maintenance History

### Next.js 16 Proxy Migration (March 2026)
- **Issue**: `middleware.ts` convention deprecated in Next.js 16.
- **Resolution**: Migrated all interception logic to `proxy.ts` root file using the `export function proxy(request: NextRequest)` named export.
- **Why `proxy.ts`**: Optimized for Node.js-based streaming; better long-term support for Next.js 16 features vs the old Edge-first middleware model.
- **What it does**: Proxies `/api/*` to `https://back-end-main.onrender.com`; enforces role-based redirects for `/admin`, `/tutor`, `/parent` routes via the `tt_role` cookie; explicitly bypasses `/api/login` to allow the local Route Handler to run.
- **Matcher**: `['/api/:path*', '/admin/:path*', '/tutor/:path*', '/parent/:path*']`
- **Do not rename** `proxy.ts` back to `middleware.ts` — that convention is deprecated.

### Parent Dashboard Hardcoded Data Fix (March 6, 2026)
- **Files changed**: `app/parent/page.tsx`, `app/parent/layout.tsx`, `app/context/StudentContext.tsx`
- **Problem**: `app/parent/page.tsx` read student name and ID from `StudentContext`, which was initialised with a hardcoded `defaultStudent = { studentName: "Zayn", studentId: 7 }`. The dropdown was hardcoded to `[{ label: 'Zayn' }, { label: 'Student2' }]`. The `CreditsViewBar` displayed `CreditContext.credits` (initialised to `3`) instead of the API-sourced `parentDetails.creditBalance`. Session fetches used the hardcoded student ID.
- **Resolution**:
  - `StudentContext`/`StudentProvider` removed from all `/parent` page imports and from `app/parent/layout.tsx`.
  - Dashboard now reads `parentDetails.selectedStudent` and `parentDetails.students` from `ParentContext` (which fetches from `GET /api/parent/{id}` on mount).
  - Dropdown built dynamically from `parentDetails.students.map(…)`; `dropdownOnChange` resolves the full `Student` object via `.find(s => s.studentId === selected.studentId)` with a guard.
  - An auto-init `useEffect` selects `students[0]` when the list first populates and `selectedStudent` is still `null`.
  - Session-fetch `useEffect` now guards on `selectedStudent?.studentId` being defined before firing.
  - `CreditsViewBar` value changed to `parentDetails.creditBalance.toString()`.
  - Balance fetch and `addStudent` call now use `parentDetails.parentId` (not hardcoded `1`).
  - `app/context/StudentContext.tsx` retained with a `@deprecated` JSDoc notice; hardcoded default left in place so any accidental remaining consumer still compiles.
- **Zero new TypeScript errors** introduced.

### CreditContext Removed from `/parent` Route (March 6, 2026)
- **Files changed**: `app/parent/layout.tsx`, `app/parent/page.tsx`, `app/parent/tutoring/page.tsx`
- **Problem**: `CreditContext` / `CreditProvider` maintained a parallel `credits` state alongside `ParentContext.parentDetails.creditBalance`, both sourced from the same API. The dashboard `page.tsx` had a redundant `getBalance()` fetch purely to sync `CreditContext`. The tutoring page called both `addCredits(-1)` (CreditContext) and `parentCtx.addCredits(-1)` (ParentContext) after every booking.
- **Resolution**:
  - `CreditProvider` removed from `app/parent/layout.tsx` — no longer wraps the parent subtree.
  - `CreditContext` import and `useContext(CreditContext)` removed from `app/parent/page.tsx` and `app/parent/tutoring/page.tsx`.
  - The standalone `getBalance()` `useEffect` in `app/parent/page.tsx` deleted entirely — `ParentContext.getParentDetails()` already populates `creditBalance`.
  - `CreditsViewBar` in tutoring page changed from `credits.toString()` → `parentDetails.creditBalance.toString()`.
  - Duplicate `addCredits(-1)` call removed from `tutoring/page.tsx` booking handler — only `parentCtx.addCredits(-1)` remains.
  - `app/parent/credits/page.tsx` required no changes — was already `ParentContext`-only.
- **Zero new TypeScript errors** introduced.

### ParentContext Pathname-Triggered Refresh (March 6, 2026)
- **File changed**: `app/context/ParentContext.tsx`
- **Problem**: `ParentProvider` stays mounted across client-side navigations within the `/parent` layout. With `[userId]` as the only dependency, `GET /api/parent/{id}` only fired on first mount (or login), so navigating between pages mid-session could display stale `creditBalance` or `students`.
- **Resolution**: Added `usePathname` from `next/navigation` as a second dependency on the fetch `useEffect`. The effect now re-calls `GET /api/parent/{id}` whenever the pathname changes within the subtree. The response is merged with `setParentDetails((prev) => ({ ...prev, ...data }))` to preserve `selectedStudent` (a frontend-only field absent from the API response) across navigations.
- **Zero new TypeScript errors** introduced.

### Login Page Styling Pass (March 2026)
- **Key changes**: `--Off-white` corrected to `#F8FAF7`; `--color-border` added; global button `border-radius` set to `14px`; `.btn-highlight` text changed to `var(--Support)` (navy) for WCAG compliance; login layout made mobile-responsive (`flex-col lg:flex-row`).
- **Known workaround**: Tailwind `bg-[var(--X)]` does not reliably generate `background-color` in this build. Use inline `style={{ backgroundColor: "var(--X)" }}` as fallback. Active example: role-selector buttons in `components/LoginForm.tsx`.
- **Remaining work**: `bg-[--...]` syntax (missing `var()`) still present on `/unauthorized`, `/tutor`, `/parent`, `/admin` pages — needs project-wide normalization. Error banner still uses raw Tailwind red — migrate to `var(--color-error)`.
