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
- **Issue**: `middleware.ts` convention deprecated.
- **Resolution**: Migrated all logic to `proxy.ts` using the `export function proxy` named export.
- **Related Context**: [.agent/context/PROXY_MIGRATION.md](.agent/context/PROXY_MIGRATION.md)
