# TutorToise — Styling Guidelines

> **Source of truth** for all UI/styling decisions. Read before writing any CSS, Tailwind class, or MUI `sx` prop.
>
> Last audited: 2026-03-05 — verified against `globals.css`, `Tokens.ts`, `Theme.ts`, and component CSS files.
>
> For per-component pixel specs and construction patterns, see `.agent/skills/component_patterns.md`.

---

## Token Pipeline

`Tokens.ts` is the single source of truth. `Theme.ts` consumes it for MUI, and `ThemeProvider.tsx` injects `:root` CSS variables at runtime.

**Rule:** Never hard-code hex values outside of `Tokens.ts`. New colors → add to `tokens.color` → expose in `cssVars` → reference via `var(--color-*)` in CSS.

> ⚠️ **Legacy globals:** `globals.css` manually declares `--Primary`, `--Outlines`, `--Accent`, `--Support`, `--Highlight`, `--Off-white`, `--Nav-Border`, `--color-border` for backward compatibility. Do not add new variables here — all new work uses `var(--color-*)` from `Tokens.ts`.

---

## Color Palette

Verified against `globals.css` and `Tokens.ts`.

| Token / CSS Var | Hex | Role |
|---|---|---|
| `--Primary` / `--color-primary` | `#CDE8B5` | Mint Green — DataBox fills, card backgrounds |
| `--Outlines` | `#2E6F5E` | Dark Forest Green — headings, metric values |
| `--Accent` | `#F39C34` | Orange — hover states, view-bar active underline |
| `--Support` / `--color-text-primary` | `#243A5E` | Navy — SideNav bg, body text, **button text on any green background** |
| `--Highlight` | `#7FBF4D` | Bright Green — CTA buttons, success alerts, active selection |
| `--Off-white` / `--color-bg` | `#F8FAF7` | Page background |
| `--Nav-Border` | `#D5D5D5` | TopNav bottom border only |
| `--color-border` | `#E2E8F0` | Subtle container/input borders |
| `--color-border-subtle` | `#F1F5F9` | Table row separators |
| `--color-text-disabled` | `#94A3B8` | Disabled state text |
| `--color-error` | `#DC2626` | Errors, low credit balance indicator |

### Do Not Use

The following `Tokens.ts` values are template leftovers — not part of the brand:

| Token | Value | Reason |
|---|---|---|
| `primaryLight` | `#60A5FA` | Tailwind blue — clashes with green palette |
| `primaryDark` | `#1D4ED8` | Tailwind blue |
| `secondary*` | purple shades | Not part of TutorToise brand |

---

## Typography

Font: **Inter** (load via `next/font`). All size/weight roles are defined in `Theme.ts → typography` — read that file directly rather than duplicating values here. Do not introduce arbitrary `font-size` values; if a new size is needed, add it to `Theme.ts` and note it here.

---

## Spacing

Base unit: **8px** (`theme.spacing(1) = 8px`). Only use values on this scale: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64px`.

**Standard gutter: 24px.** Apply to all new grid and flex layouts.

---

## Border Radius

TutorToise uses a generously rounded visual style. **28px is the brand signature radius** for container-level surfaces.

| Surface type | Radius |
|---|---|
| Containers (DataBox, cards, modals, alerts) | **28px** |
| Buttons | **14px** |
| Credit option pills | **18px** |
| Inputs, small chips | **8px** |
| Avatars | **50%** |

> ⚠️ MUI Card in `Theme.ts` currently uses `16px` — should be `28px`. See DD-06.

---

## Shadows

Three tokens: `--shadow-sm` (tabs), `--shadow-md` (cards), `--shadow-lg` (modals/drawers). Defined in `Tokens.ts → tokens.shadow`. MUI components default to `elevation: 0` — use `border` + these tokens for depth, never MUI elevation.

---

## CSS Naming — BEM

All component CSS files use **BEM** (Block Element Modifier) conventions.

```
.block               — component root      e.g. .side-nav
.block__element      — child part          e.g. .side-nav__item
.block__element--modifier — state/variant  e.g. .side-nav__item--active
```

**Block names** use `kebab-case`. Multi-word blocks are hyphenated, not camel-cased.

Real examples from the codebase:

| Class | Type |
|---|---|
| `.side-nav` | Block |
| `.side-nav__item` | Element |
| `.side-nav__item--active` | Modifier (active state) |
| `.sessions-table__cell--action` | Modifier (variant) |
| `.topnav__user-container` | Element (multi-word, hyphenated) |
| `.shell__body`, `.shell__content` | Elements of the root shell block |

**Rules:**
- New component CSS must follow `block__element--modifier` with double underscores and double hyphens.
- Block names match the component's root CSS class — keep them consistent with the JSX `className`.
- Do not nest BEM selectors (`.side-nav .side-nav__item` is fine; `.side-nav__list .side-nav__item` breaks BEM flat structure).
- Do not use BEM alongside Tailwind in the same element — pick one per component (see coding standards §1).

> ⚠️ **Known inconsistency:** `Modal.css` uses `.add-student-modal_header` (single underscore) — a typo that predates this convention being documented. Do not replicate this pattern; use `__` in any new modal elements.

---

## Key Rules

### No Hard-Coded Values
1. **CSS files** — use `var(--Primary)`, `var(--color-border)` etc. Never write a hex value in a new `.css` file.
2. **TSX / MUI files** — use `theme.palette.*` or `sx` props. Avoid `style={{ color: '#243a5e' }}`.
3. **New color** — add to `tokens.color` → expose in `cssVars` → reference via `var(--color-*)`.
4. **Spacing** — use only the 8px-base scale. Document exceptions here.

### Tailwind CSS Variable Bug

`bg-[var(--X)]` does **not** reliably generate a `background-color` declaration in this project's Tailwind build — only ring/border utilities using the same syntax work correctly.

**Workaround:** When a CSS-variable background is critical, apply it via inline `style` prop:
```tsx
style={{ backgroundColor: "var(--Highlight)" }}
```
Active example: role-selector buttons in `components/LoginForm.tsx`.

All arbitrary CSS-var references must use `bg-[var(--X)]` syntax (not the old `bg-[--X]` form — that is invalid and must be normalized project-wide).

### Accessibility (WCAG AA)

- **Never use `color: white` on `--Highlight` (#7FBF4D) backgrounds.** White-on-green contrast = 2.2:1 (fails). Use `var(--Support)` (#243A5E) — contrast = 4.7:1 (passes). This applies to: CTA buttons, success alerts, add-student confirm button.
- **Focus ring standard:** `outline: 3px solid rgba(47, 125, 79, 0.6); outline-offset: 2px`
- **Touch targets:** minimum 44 × 44px on all interactive elements.
- **Modals:** `role="dialog" aria-modal="true" aria-labelledby="[heading-id]"`
- **SideNav `<aside>`:** add `aria-label="Main navigation"`.
- **Icon-only nav links:** `aria-label` on the `<Link>` wrapper.

### Button Variants & States

| Variant | Background | Text | Hover |
|---|---|---|---|
| Primary CTA | `var(--Highlight)` | `var(--Support)` navy | `var(--Accent)` orange bg |
| Default / Secondary | `var(--Support)` navy | `#FFFFFF` | `opacity: 0.8` |
| Cancel | `#2E2E2E` | `#FFFFFF` | `opacity: 0.8` |
| MUI Contained | `var(--color-primary)` mint | `var(--color-text-primary)` navy | `opacity: 0.8` |

All variants: disabled → `opacity: 0.4; cursor: not-allowed` · focus-visible → `outline: 3px solid rgba(47, 125, 79, 0.6); outline-offset: 2px` · loading → spinner replaces label, maintain dimensions.

### Layout Shell

Shell containers are structural — **never modify for page-level styling:**
- `.shell__body` — right-hand column (flex-col, fills remaining width)
- `.shell__content` — scrollable content area
- `.side-nav` — left sidebar (max-width: 100px, min-height: 100vh)
- `.topnav` — top bar (height: 84px)

Rules:
- Never use `width: 100vw` on inner containers — causes horizontal scroll. Use `width: 100%`.
- App is **desktop-first**. MUI breakpoints: xs(0) sm(600px) md(900px) lg(1200px) xl(1536px).

---

## Outstanding Design Debt

Verified against the codebase. Fix in priority order.

| ID | Severity | Location | Issue | Fix |
|---|---|---|---|---|
| DD-02 | **High** | `CreditOpts.css:31` | Pill bg uses hardcoded `#f2a23a` not `var(--Accent)` `#F39C34` | Replace with `var(--Accent)` |
| DD-03 | **High** | `CreditOpts.css`, `credits.css`, `Alert.css` | `color: white` on `#7FBF4D` bg — WCAG fail (2.2:1) | Change to `var(--Support)` |
| DD-04 | **Medium** | `Tokens.ts` `tokens.color.surface` | Value has trailing semicolon: `"#2e6f5e;"` — breaks `var(--color-surface)` CSS output | Remove trailing `;` |
| DD-06 | **Medium** | `Theme.ts` MuiCard override | `border-radius: 16` — conflicts with brand 28px container radius | Change to `28` |
| DD-07 | **Low** | `Tokens.ts` | `primaryLight`, `primaryDark`, `secondary*` are blue/purple template leftovers still wired into MUI palette | Replace with brand greens or remove |
| DD-08 | **Low** | `parent/dashboard.css` | Data row `gap: 20px` — standard gutter is 24px | Change to `gap: 24px` |
| DD-BG | **Low** | `Tokens.ts` | `tokens.color.bg = "#F8FAFC"` mismatches `globals.css --Off-white = "#F8FAF7"` | Align to `#F8FAF7` |
| DD-TAB | **Low** | `Theme.ts` MuiTab | Uses `var(--color-textPrimary)` (missing hyphen) — should be `var(--color-text-primary)` | Fix token name |
