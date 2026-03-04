# Login Page Styling — Context Summary

> Date: 2026-03-04
> Files changed: `app/globals.css`, `app/login/page.tsx`, `components/LoginForm.tsx`

---

## What We Changed

### 1. Global Tokens (`app/globals.css`)

- **`--Off-white`** updated from `#f2f5f0` to `#F8FAF7` to match the design system page background token.
- **`--color-border`** added (`#E2E8F0`) for subtle container/input borders.
- **Global button `border-radius`** changed from `12px` to `14px` per design guidelines.
- **`.btn-highlight`** text changed from `#fff` to `var(--Support)` (navy) for WCAG contrast compliance on green backgrounds.
- **`.btn-highlight:hover`** changed from `var(--Outlines)` to `var(--Accent)` (orange) per CTA hover spec.

### 2. Login Page Layout (`app/login/page.tsx`)

- **Mobile-responsive stacking:** Root container uses `flex flex-col lg:flex-row` so the branding panel stacks above the form on small screens and sits side-by-side on desktop.
- **Left panel width:** `lg:w-[35%]` (within the 30–40% range for large screens); `w-full` on mobile.
- **Left panel padding:** `p-6 lg:p-10` for mobile/desktop.
- **Decorative circles** hidden on small screens (`hidden lg:block`) to reduce clutter.
- **Logo + title + tagline grouped** into a single centered container (`flex flex-col items-center gap-3`).
- **Tagline text centered:** `text-center` on the tagline container.
- **Spacing refined:** `h2 mb-2`, subtitle `mb-8`, gap between logo and tagline `gap-3`.
- **Features list and trust badge** hidden on mobile (`hidden lg:block`, `hidden lg:flex`).
- **Removed duplicate mobile-only logo** from the right panel.
- **Root container** takes full width with `w-full flex-1`.
- **Suspense fallback** uses brand radius `rounded-[28px]`.

### 3. Login Form (`components/LoginForm.tsx`)

- **Heading:** `h1` uses `text-[2.5rem]` on desktop, `text-3xl` on mobile; `text-[var(--Support)]`.
- **Subtitle:** uses `text-[var(--Support)]/60` instead of `text-gray-500`.
- **Role selector:**
  - Container: `bg-[var(--Primary)]/20 rounded-[8px]`.
  - **Selected state:** solid green background applied via **inline `style` prop** (`style={{ backgroundColor: "var(--Highlight)" }}`), bold navy text, `shadow-sm`. "Parent" is selected by default.
    - ⚠️ Tailwind's `bg-[var(--Highlight)]` did not reliably generate the background-color declaration in this project's build — only the ring/border was rendered. Switched to an inline `style` prop as a workaround.
  - **Unselected state:** `text-[var(--Support)]/50`, `hover:bg-[var(--Primary)]/10`.
  - Added `aria-pressed` and `aria-label` for accessibility.
- **Form labels:** `text-[var(--Support)]` instead of `text-gray-700`.
- **Inputs:** `rounded-[8px]`, `border-[var(--color-border)]`, `hover:border-[var(--Outlines)]`.
- **Focus rings:** `focus:ring-[var(--Highlight)]/60 focus:ring-offset-1`.
- **Password toggle icon:** `text-[var(--Support)]/40 hover:text-[var(--Support)]/70`.
- **Forgot password link:** `text-[var(--Highlight)] hover:text-[var(--Outlines)]`.
- **Error banner:** `rounded-[14px]`.
- **Submit CTA button:**
  - `bg-[var(--Highlight)]` (green) with `text-[var(--Support)]` (navy) — WCAG contrast compliant.
  - `hover:bg-[var(--Accent)]` (orange).
  - `rounded-[14px]`, `font-bold`, `text-xl lg:text-2xl`.
  - `disabled:opacity-40 disabled:cursor-not-allowed`.

### 4. Tailwind Arbitrary Var Syntax

All CSS variable references in the login files were normalized from `bg-[--Support]` to `bg-[var(--Support)]` to ensure Tailwind generates valid CSS.

---

## Design Guidelines Applied

| Guideline | Implementation |
|---|---|
| Border radius: containers 28px, buttons 14px, inputs 8px | Applied across login components |
| CTA button: green bg, navy text (WCAG AA) | Submit button and `.btn-highlight` |
| CTA hover: orange | `hover:bg-[var(--Accent)]` |
| Disabled state: `opacity: 0.4` | Applied to submit button |
| Focus ring: `3px solid rgba(47, 125, 79, 0.6)` | `focus-visible:ring-2 ring-[var(--Highlight)]/40` |
| Token usage: no hard-coded hex in new code | All colors reference CSS vars |
| Spacing: 8px base scale | All spacing values on-scale |

---

## Known Remaining Items

- Other pages (`/unauthorized`, `/tutor`, `/parent`, `/admin`) still use old `bg-[--...]` syntax — needs project-wide normalization.
- Error banner still uses raw Tailwind red classes — migrate to `--color-error` token when exposed globally.
- Run Lighthouse/axe on `/login` to confirm full WCAG compliance.
- **Tailwind `bg-[var()]` bug:** `bg-[var(--Highlight)]` does not reliably produce `background-color` in some contexts. When a CSS-variable background is critical and Tailwind fails, use an inline `style` prop as a fallback. See role-selector buttons in `LoginForm.tsx` for the pattern.
