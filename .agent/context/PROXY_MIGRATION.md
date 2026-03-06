# Context Summary: Next.js 16 Middleware to Proxy Migration

## Overview
This feature migrates the application's global request interception from the deprecated `middleware.ts` convention to the new `proxy.ts` convention introduced in Next.js 16.1.6.

## Changes Checklist
- [x] Create `proxy.ts` in the project root.
- [x] Migrate rewriting logic (API proxying) to the `proxy` named export.
- [x] Migrate redirect logic (Role-based protection) to the `proxy` named export.
- [x] Update `config.matcher` in the new convention.
- [x] Remove deprecated `middleware.ts` file.

## Why the Change?
Next.js 16 deprecated the `middleware.ts` convention for global interception. The new `proxy.ts` convention separates Edge-first middleware from high-performance proxying. 
- **Performance**: The `proxy` convention is optimized for Node.js-based streaming.
- **Modernization**: Adhering to the latest framework standards avoids compiler warnings and provides better long-term support for Next.js 16 features.

## Technical Details
- **File**: `proxy.ts`
- **Primary Export**: `export function proxy(request: NextRequest)`
- **Matcher**: `['/api/:path*', '/admin/:path*', '/tutor/:path*', '/parent/:path*']`
- **Key Functions**: 
    - Proxies `/api/*` to `https://back-end-main.onrender.com`.
    - Enforces role-based redirects for `/admin`, `/tutor`, and `/parent` based on the `tt_role` cookie.
    - Explicitly bypasses `/api/login` rewrites to allow the local Route Handler to execute.

## Verification Notes
- Tested that API requests correctly reach the Render backend.
- Confirmed that unauthorized users are redirected to `/login` from protected routes.
- Verified that the "middleware file convention is deprecated" warning is resolved.
