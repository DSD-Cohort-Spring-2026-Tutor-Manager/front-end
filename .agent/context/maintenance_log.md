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

### Login Page Styling Pass (March 2026)
- **Files changed**: `app/globals.css`, `app/login/page.tsx`, `components/LoginForm.tsx`
- **Key changes**: `--Off-white` corrected to `#F8FAF7`; `--color-border` added; global button `border-radius` set to `14px`; `.btn-highlight` text changed to `var(--Support)` (navy) for WCAG compliance; login layout made mobile-responsive (`flex-col lg:flex-row`).
- **Known workaround**: Tailwind `bg-[var(--X)]` does not reliably generate `background-color` in this build. Use inline `style={{ backgroundColor: "var(--X)" }}` as fallback. Active example: role-selector buttons in `components/LoginForm.tsx`.
- **Remaining work**: `bg-[--...]` syntax (missing `var()`) still present on `/unauthorized`, `/tutor`, `/parent`, `/admin` pages — needs project-wide normalization. Error banner still uses raw Tailwind red — migrate to `var(--color-error)`.
