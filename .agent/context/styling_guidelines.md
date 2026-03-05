# TutorToise Design System — Styling Guidelines

> **Source of Truth** for all UI/UX decisions. Every new component must reference this document before writing a single line of CSS or MUI `sx` prop.
>
> Last audited: 2026-03-03
> Audited against: `app/globals.css`, `app/theme/Tokens.ts`, `app/theme/Theme.ts`, all component CSS/TSX files, and `.screenshots/` visual review.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Color Palette](#2-color-palette)
3. [Typography](#3-typography)
4. [Spacing Scale](#4-spacing-scale)
5. [Border Radius](#5-border-radius)
6. [Elevation & Shadows](#6-elevation--shadows)
7. [Layout & Grid](#7-layout--grid)
8. [Component Library](#8-component-library)
   - [Buttons](#81-buttons)
   - [Cards](#82-cards)
   - [Modals](#83-modals)
   - [Navigation](#84-navigation)
   - [Alerts](#85-alerts)
   - [Credit Option Pills](#86-credit-option-pills)
9. [Accessibility Audit](#9-accessibility-audit)
10. [Design Debt Register](#10-design-debt-register)
11. [Best Practices — Responsive Design](#11-best-practices--responsive-design)
12. [Token Usage Rules](#12-token-usage-rules)

---

## 1. Architecture Overview

The design system uses a **three-layer token pipeline**:

```
app/theme/Tokens.ts              ← Single source of truth (JS values)
        │
        ├─► app/theme/Theme.ts           ← MUI createTheme() consumes tokens
        └─► app/theme/ThemeProvider.tsx  ← Injects :root CSS variables at runtime
```

**Rule:** Never hard-code hex values outside of `Tokens.ts` and `globals.css`. If a new color is needed, add it to `tokens.color` first, expose it in `cssVars`, then reference `var(--color-*)` in CSS files.

> ⚠️ **Existing exception:** `app/globals.css` manually declares `:root` CSS variables (`--Primary`, `--Outlines`, `--Accent`, `--Support`, `--Highlight`, `--Off-white`, `--Nav-Border`). These are **legacy globals** preserved for existing component CSS. Do not add new variables here. All new work uses `var(--color-*)` names from the `cssVars` map in `Tokens.ts`.

---

## 2. Color Palette

### 2.1 Brand Color Map

| Token / CSS Var | Hex | Functional Role |
|---|---|---|
| `--Primary` / `--color-primary` | `#CDE8B5` | Mint Green — card fills (DataBox, billing card) |
| `--Outlines` | `#2E6F5E` | Dark Forest Green — page H1/H2 headings, metric value text, modal headers |
| `--Accent` | `#F39C34` | Highlight Orange — hover states, view-bar active underline |
| `--Support` / `--color-text-primary` | `#243A5E` | Action Navy — SideNav bg, default button fill, body text |
| `--Highlight` | `#7FBF4D` | Bright Green — primary CTA buttons, avatar ring, success alerts, active selection |
| `--Off-white` / `--color-bg` | `#F8FAF7` | Page background; SideNav label text |
| `--Nav-Border` | `#D5D5D5` | TopNav bottom border only |
| `--color-border` | `#E2E8F0` | Subtle container borders (MUI cards, inputs) |
| `--color-border-subtle` | `#F1F5F9` | Table row separators |
| `--color-text-disabled` | `#94A3B8` | Disabled state text |
| `--color-error` | `#DC2626` | Destructive actions; credit balance "low" indicator |

### 2.2 Quick Reference by Usage

```
SideNav background ................ #243A5E  (var(--Support))
Page / body background ............ #F8FAF7  (var(--Off-white))
DataBox card fill ................. #CDE8B5  (var(--Primary))
Billing card fill ................. #CDE8B5  (var(--Primary))
Primary CTA (Purchase Credits) .... #7FBF4D  (var(--Highlight)) — navy text; see §9
CTA hover background .............. #F39C34  (var(--Accent))
Default button background ......... #243A5E  (var(--Support))
Success alert background .......... #7FBF4D  (var(--Highlight)) — navy text; see §9
Credit balance low ................ #DC2626  (var(--color-error))
Credit balance healthy ............ #2E6F5E  (var(--Outlines))
```

### 2.3 Template Leftovers — Do Not Use

The following `Tokens.ts` values were inherited from a UI template and are not part of the TutorToise brand. They must not appear in any component:

| Token | Value | Reason to Avoid |
|---|---|---|
| `primaryLight` | `#60A5FA` | Tailwind blue — clashes with green palette |
| `primaryDark` | `#1D4ED8` | Tailwind blue — clashes with green palette |
| `secondary` | `#7C3AED` | Purple — not part of brand |
| `secondaryLight` | `#A78BFA` | Purple — not part of brand |
| `secondaryDark` | `#5B21B6` | Purple — not part of brand |

---

## 3. Typography

### 3.1 Font Stack

```
Primary:   "Inter", "Helvetica Neue", Arial, sans-serif
Monospace: "JetBrains Mono", "Fira Code", monospace
```

Inter must be loaded via `next/font` or a `<link>` in the root layout. Do not rely on system fallbacks in production.

### 3.2 Type Scale (MUI Theme)

All defined in `app/theme/Theme.ts → typography`. Use these roles — do not introduce arbitrary `font-size` values in new components.

| Role | MUI Variant | Size | Weight | Line Height | Usage |
|---|---|---|---|---|---|
| Page Title | `h1` | 2.5rem (40px) | 700 | 1.2 | Dashboard page headings |
| Section Title | `h2` | 2rem (32px) | 700 | 1.25 | "Billing information", "Credit options" |
| Sub-section | `h3` | 1.75rem (28px) | 600 | 1.3 | Card group titles |
| Card Heading | `h4` | 1.5rem (24px) | 600 | 1.35 | Billing title, Credit opts title |
| Component Label | `h5` | 1.25rem (20px) | 600 | 1.4 | Small section labels |
| Small Heading | `h6` | 1rem (16px) | 600 | 1.4 | Inline labels |
| Body | `body1` | 1rem (16px) | 400 | 1.6 | Paragraph text, descriptions |
| Small Body | `body2` | 0.875rem (14px) | 400 | 1.57 | Helper text, input labels |
| Caption | `caption` | 0.75rem (12px) | 400 | — | Timestamps, footnotes |
| Overline | `overline` | 0.75rem (12px) | 600 | — | Table headers (uppercase, 0.08em tracking) |
| Button | `button` | inherited | 700 | — | All button text, `text-transform: none` |

### 3.3 Component-Specific Overrides (as-built)

Documented existing deviations — intentional at the component level:

| Component | Size | Weight | Color |
|---|---|---|---|
| Credits page `<h1>` | 1.9rem | 700 | `#2E6F5E` |
| Billing / Credit opts section `<h2>` | 24px | 700 | `#243A5E` |
| Confirm modal message | 38px | 600 | `#2E6F5E` |
| Add Student modal header | 32px | 700 | `#2E6F5E` |
| DataBox metric value | 40px | 800 | `#2E6F5E` (uppercase) |
| DataBox metric title | 24px | 400 | inherited |
| View-bar credits label | 18px | 600–700 | `#243A5E` |
| Credit option pill text | 18px | 800 | `#FFFFFF` |
| Credit total row | 26px | 900 | label `#1F2A44`, value `#2F7D4F` |
| Purchase CTA button | 24px | 700 | `#243A5E` (see §9) |
| Confirm/Cancel modal buttons | 28px | 600 | `#FFFFFF` |

---

## 4. Spacing Scale

Base unit: **8px** (MUI `theme.spacing(1) = 8px`).

| Token | Value | Common Usage |
|---|---|---|
| `space.1` | 4px | Icon padding, micro gaps |
| `space.2` | 8px | Input internal padding |
| `space.3` | 12px | Table cell vertical padding |
| `space.4` | 16px | Form row spacing |
| `space.5` | 20px | Card row gap, section header margin |
| `space.6` | **24px** | **Standard gutter** — view-bar, grid gutters, section separators |
| `space.8` | 32px | Section-to-section vertical rhythm |
| `space.10` | 40px | Page-level horizontal padding, nav item gap |
| `space.12` | 48px | Large vertical separators |
| `space.16` | 64px | Page section separation |

### 4.1 Component Padding Reference

| Surface | Padding |
|---|---|
| Dashboard container | `0 40px 40px` |
| Credits page | `20px 40px 40px` |
| TopNav (horizontal) | `20px 40px` |
| Billing card | `22px 24px` |
| Confirm modal content | `60px 100px` |
| SideNav container | `10px 20px 20px` |
| Global `<button>` (default) | `10px 15px` |
| MUI Button medium | `8px 20px` |
| MUI Button large | `12px 28px` |
| MUI Button small | `4px 12px` |
| Credit option pill | `14px 22px` |

---

## 5. Border Radius

TutorToise uses a **friendly, generously rounded** visual style. **28px is the brand signature radius** for all container-level surfaces.

### 5.1 Token Radii (use for new MUI-based components)

| Token | Value | Use |
|---|---|---|
| `radius.sm` | 6px | Inputs, small chips |
| `radius.md` | 10px | MUI base shape, table row corners |
| `radius.lg` | 16px | MUI Cards (pending upgrade to 28px — see DD-06) |
| `radius.full` | 9999px | Pill-shaped elements |

### 5.2 Component Radii (as-built)

| Component | Radius |
|---|---|
| DataBox (small & medium) | **28px** |
| Billing card | **28px** |
| Modal content panel | **28px** |
| Floating alerts | **28px** |
| Default `<button>` (globals.css) | **14px** |
| Modal action buttons | **14px** |
| Credit option pill | **18px** |
| Add Student input fields | **8px** |
| User avatar | **50%** |
| MUI Card (current) | 16px → upgrade to 28px |

---

## 6. Elevation & Shadows

| Token | Value | Usage |
|---|---|---|
| `shadow.sm` | `0 1px 2px 0 rgb(0 0 0 / 0.05)` | Selected tab lift |
| `shadow.md` | `0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05)` | Floating cards |
| `shadow.lg` | `0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.05)` | Modals, drawers |
| Modal (as-built) | `0px 0px 4px rgba(0,0,0,0.25)` | Confirm & Add Student modals |

All MUI components default to `elevation: 0`; visual depth is provided via `border` and `box-shadow` tokens.

---

## 7. Layout & Grid

### 7.1 App Shell Structure

```
┌──────────────────────────────────────────────────────────────┐
│  SideNav (max 100px)  │  shell__body (flex-col, fills rest)  │
│  bg: #243A5E          │  ┌────────────────────────────────┐  │
│                       │  │  TopNav (84px tall)            │  │
│                       │  ├────────────────────────────────┤  │
│                       │  │  Page Content                  │  │
│                       │  │  max-width: 1120px             │  │
│                       │  │  padding: 0 40px 40px          │  │
│                       │  └────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

### 7.2 Container Width Reference

| Context | Max Width |
|---|---|
| Dashboard content area | `1120px` |
| Billing card | `412px` |
| Credit options grid | `550px` |
| Purchase CTA button | `515px` |
| Add Student modal | `475px` (fixed) |
| Confirm modal | `60vw` |
| Alert toast | `412px` |

### 7.3 Grid Rules

- **Standard gutter:** 24px (`space.6`) — apply to all new grid and flex layouts.
- **Dashboard data row:** currently `gap: 20px` — standardize to `24px` (see DD-08).
- **Credit options grid:** intentional asymmetric gap `22px` row / `48px` column.
- Use `display: flex` for linear layouts; `display: grid` only for multi-column option matrices.

### 7.4 TopNav Specs

| Property | Value |
|---|---|
| Height | `84px` |
| Border | Bottom only — `3px solid #D5D5D5` |
| Padding | `20px 40px` |
| Layout | `justify-content: space-between` (logo ← → user info) |
| Notification icon | `34px × 34px` |
| User avatar | `40px × 40px`, `border: 3px solid #7FBF4D`, `border-radius: 50%` |
| Username | `18px / 600`, `color: #243A5E`, `margin-left: 17px` |

---

## 8. Component Library

### 8.1 Buttons

#### Primary CTA (Purchase Credits / Confirm Action)

```css
background-color: var(--Highlight);  /* #7FBF4D */
color: var(--Support);               /* #243A5E — WCAG compliant; NOT white */
font-size: 24px;
font-weight: 700;
border-radius: 14px;
padding: 10px 15px;
width: 100%;
max-width: 515px;
```

Hover:
```css
background-color: var(--Accent);     /* #F39C34 */
color: var(--Support);               /* #243A5E */
```

#### Default / Secondary Button (Navy)

```css
background-color: var(--Support);    /* #243A5E */
color: #FFFFFF;
font-weight: 600;
border-radius: 14px;
padding: 10px 15px;
/* Hover: opacity 0.8 */
```

#### Cancel Button

```css
background-color: #2E2E2E;
color: #FFFFFF;
font-weight: 600;
border-radius: 14px;
width: 164px;
height: 44px;   /* min for touch targets */
```

#### MUI Contained Button (general UI actions)

```css
background-color: var(--color-primary);  /* #CDE8B5 */
color: var(--color-text-primary);        /* #243A5E */
border-radius: 8px;
padding: 8px 20px;
font-weight: 700;
text-transform: none;
/* Hover: opacity 0.8 */
```

#### Secondary / Underline Button (View-bar)

```css
background: transparent;
color: var(--Support);
font-weight: 600;
border-bottom: 2px solid var(--Accent);
/* Hover: border-bottom-color: var(--Outlines) */
```

#### Button State Rules

| State | Style |
|---|---|
| Disabled | `opacity: 0.4`, `cursor: not-allowed` |
| Loading | Spinner replaces label; maintain dimensions |
| Focus-visible | `outline: 3px solid rgba(47, 125, 79, 0.6)` |
| Hover | `opacity: 0.8` or specific color swap per variant above |

---

### 8.2 Cards

#### DataBox — Small

```css
width: 265px;
height: 204px;
background-color: var(--Primary);    /* #CDE8B5 */
border-radius: 28px;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
```

Internal typography:
- Title text: `24px / 400`
- Metric value: `40px / 800`, `color: var(--Outlines)`, `text-transform: uppercase`, `margin-bottom: 20px`
- Action button / dropdown: `background: var(--Support)`, `color: #FFF`, `border-radius: 14px`, `padding: 10px 15px`

#### DataBox — Medium

```css
width: 550px;
height: 204px;
background-color: var(--Primary);
border-radius: 28px;
```

#### Billing Card

```css
background-color: var(--Primary);
max-width: 412px;
padding: 22px 24px;
border-radius: 28px;
display: flex;
justify-content: space-between;
```

Edit action: plain text link, `color: var(--Support)`, `font-weight: 500`.

#### MUI General Card (panels, tables)

```css
border-radius: 28px;    /* upgrade from current 16px per DD-06 */
border: 1px solid var(--color-border);
background-color: #FFFFFF;
elevation: 0;
```

---

### 8.3 Modals

#### Overlay

```css
position: fixed;
inset: 0;
background-color: rgba(0, 0, 0, 0.4);   /* 40% black */
z-index: 1;
display: flex;
justify-content: center;
align-items: center;
```

#### Confirm Modal Content

```css
width: 60%;
border-radius: 28px;
padding: 60px 100px;
background-color: #FFFFFF;
box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
display: flex;
flex-direction: column;
align-items: center;
```

Message text: `38px / 600 / color: var(--Outlines)`, `text-align: center`

Button row: `display: flex; flex-direction: row; gap: 20px; width: 50%`

Action buttons: `height: 73px`, `padding: 9px 61px`, `font-size: 28px`, `border-radius: 14px`
- **Confirm:** `background: var(--Support)` (#243A5E)
- **Cancel:** `background: #2E2E2E` (visually distinct — darker)

#### Add Student Modal

```css
width: 475px;
padding-top: 0;
border-radius: 28px;    /* inherits from .modal-content */
```

- Header: `32px / 700 / color: var(--Outlines)`, `margin-top: 21px`
- Body text: `16px / color: var(--Support)`
- Input fields: width `366px`, `border-radius: 8px`, `border-color: rgba(33,33,33,0.4)`
- Button row: `width: 366px`, `padding-top: 15px`, each button `164px × 44px`
  - Confirm: `background: var(--Highlight)` (#7FBF4D), text `var(--Support)` (#243A5E)
  - Cancel: `background: #2E2E2E`, text `#FFFFFF`

#### ARIA Requirements for Modals

```tsx
<div role="dialog" aria-modal="true" aria-labelledby="modal-heading">
  <h2 id="modal-heading">...</h2>
  ...
</div>
```

---

### 8.4 Navigation

#### SideNav

```css
max-width: 100px;
min-height: 100vh;
background-color: var(--Support);     /* #243A5E — applied via Tailwind bg-(--Support) */
padding: 10px 20px 20px;
display: flex;
flex-direction: column;
```

| Property | Value |
|---|---|
| Logo margin-bottom | `60px` |
| Nav item gap | `40px` |
| Icon label color | `var(--Off-white)` (#F8FAF7), `font-weight: 600` |
| Icon opacity (default) | `0.7` |
| Icon opacity (hover/active) | `1.0`, `transition: 0.2s ease-in` |
| Logout position | `margin-top: auto` (pinned to bottom) |

Responsive — at ≤ 950px height: icons shrink to `35×39px`; at ≤ 700px: `25×29px`, labels 14px.

#### TopNav — see §7.4

---

### 8.5 Alerts

#### Floating Success Toast

```css
position: fixed;
top: 80px;
right: 24px;
z-index: 1000;
width: 412px;
height: 105px;
border-radius: 28px;
background-color: var(--Highlight);   /* #7FBF4D */
```

Text: `24px / 700 / color: var(--Support)` (#243A5E — **not white**, see §9), `text-align: center`, `line-height: 32px`

Animation:

```css
/* Enter */
transform: translateX(0);
opacity: 1;

/* Exit */
transform: translateX(120%);
opacity: 0;

/* Transition */
transition: transform 300ms ease-out, opacity 300ms ease-out;
```

---

### 8.6 Credit Option Pills

```css
/* Pill button */
background: var(--Accent);               /* #F39C34 — NOT #f2a23a; see DD-02 */
color: #FFFFFF;
border-radius: 18px;
padding: 14px 22px;
min-width: 150px;
text-align: center;
font-weight: 800;
font-size: 18px;
```

Selected state: `outline: 3px solid var(--Highlight)` (#7FBF4D)

Focus-visible state: `outline: 3px solid rgba(47, 125, 79, 0.6)`

Price label (beside pill): `font-weight: 800; font-size: 20px; color: #1F2A44`

Total row: `font-weight: 900; font-size: 26px`
- "Total:" label → `color: #1F2A44`
- Amount → `color: #2F7D4F`

---

## 9. Accessibility Audit

### 9.1 Purchase CTA — WCAG Contrast Failure

| Background | Text Color | Contrast Ratio | Requirement | Status |
|---|---|---|---|---|
| `#7FBF4D` | `#FFFFFF` white | ≈ 2.2:1 | 3.0:1 (large text, 24px/700) | **FAIL** |
| `#7FBF4D` | `#243A5E` navy | ≈ 4.7:1 | 3.0:1 (large text) | **PASS** ✓ |

**Immediate fix** — `app/_components/CreditOpts/CreditOpts.css` and `app/parent/credits/credits.css`:

```css
/* Change all Highlight-background elements to use navy text */
.credits__purchase-btn          { color: var(--Support); }   /* was: color: white */
.add-student-confirm-button     { color: var(--Support); }
.success-alert p                { color: var(--Support); }   /* app/_components/Alert/Alert.css */
```

### 9.2 Focus Management

All interactive elements must show a visible `:focus-visible` ring. The existing credit pill pattern is the standard:
```css
outline: 3px solid rgba(47, 125, 79, 0.6);
outline-offset: 2px;
```

### 9.3 Touch Targets

Minimum tap area: **44 × 44px** (WCAG 2.5.5 / Apple HIG). The Add Student modal buttons at `height: 41px` fall short. Set to `44px` minimum.

### 9.4 ARIA

- Modal: `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing to the heading element.
- SideNav `<aside>`: add `aria-label="Main navigation"`.
- Icon-only nav links: `aria-label` on the `<Link>` wrapper (not just `<img alt>`).

---

## 10. Design Debt Register

| ID | Severity | File | Issue | Fix |
|---|---|---|---|---|
| DD-01 | **High** | `_components/CreditOpts/CreditOpts.tsx:17` | `'7 Credit'` missing plural "s" | Change to `'7 Credits'` |
| DD-02 | **High** | `_components/CreditOpts/CreditOpts.css:31` | Pill uses `#f2a23a`, not `var(--Accent)` `#f39c34` | Replace with `var(--Accent)` |
| DD-03 | **High** | `CreditOpts.css`, `credits.css`, `Alert.css` | White text on `#7FBF4D` fails WCAG AA | Use `var(--Support)` as text color |
| DD-04 | **Medium** | `theme/Tokens.ts:33` | `tokens.color.surface` value contains trailing semicolon: `"#2e6f5e;"` | Remove trailing `;` |
| DD-05 | **Medium** | `globals.css` | Manual `:root` CSS vars duplicate ThemeProvider injection | After migrating all CSS to `var(--color-*)`, remove from `globals.css` |
| DD-06 | **Medium** | `theme/Theme.ts` (MuiCard) | MUI Card `border-radius: 16px` conflicts with brand 28px container rounding | Update to `28px` |
| DD-07 | **Low** | `theme/Tokens.ts` | `primaryLight`, `primaryDark`, `secondary*` are blue/purple template leftovers | Replace with brand greens or remove |
| DD-08 | **Low** | `parent/dashboard.css` | `gap: 20px` on data row; standard gutter is `24px` | Change to `gap: 24px` |
| DD-09 | **Low** | `_components/Modal/Modal.tsx` | Confirm and Cancel modal buttons share identical Navy style | Style Cancel differently (e.g., `#2E2E2E`) |
| DD-10 | **Low** | `parent/credits/page.tsx:27` | Modal text: "Purchase 1 credits?" — missing pluralization guard | `` `Purchase ${n} ${n === 1 ? 'credit' : 'credits'}?` `` |

---

## 11. Best Practices — Responsive Design

### 11.1 Breakpoints

Use MUI's default breakpoints consistently (never introduce custom values):

| Key | Min Width | Context |
|---|---|---|
| `xs` | 0px | Mobile portrait |
| `sm` | 600px | Mobile landscape / small tablet |
| `md` | 900px | Tablet |
| `lg` | 1200px | Desktop |
| `xl` | 1536px | Wide desktop |

### 11.2 Shell & Navigation

TutorToise is currently **desktop-first**. When adding mobile support:

- **SideNav < `md`:** Collapse to a bottom tab bar or hamburger slide-in drawer. The `100px` fixed sidebar must not overlay content on mobile.
- **TopNav < `sm`:** Reduce padding from `40px` to `16px`; hide the username label; show avatar + icon only.

### 11.3 Modal Responsive Behavior

```css
/* Tablet */
@media (max-width: 900px) {
  .modal-content {
    width: 90%;
    padding: 40px 32px;
  }
}

/* Mobile — bottom sheet pattern */
@media (max-width: 600px) {
  .modal-content {
    width: 100%;
    border-radius: 28px 28px 0 0;
    padding: 32px 24px;
    position: fixed;
    bottom: 0;
  }
}
```

### 11.4 Cards & Grid

| Rule | Mobile (< `sm`) |
|---|---|
| DataBox fixed widths (`265px`, `550px`) | `width: 100%` |
| `.dashboard__data-row` flex | Add `flex-wrap: wrap` |
| Credit options grid `1fr 1fr` | Collapse to `1fr` |
| Billing card `max-width: 412px` | `max-width: 100%` |

### 11.5 Typography on Mobile

| Element | Desktop | Mobile (< `sm`) |
|---|---|---|
| Confirm modal text | 38px | 24px |
| DataBox metric value | 40px | 28px |
| Purchase CTA button | 24px | 18px |
| Page H1 | 2.5rem | 1.75rem |

### 11.6 General Rules

- Minimum interactive tap target: **44 × 44px**.
- Never use `width: 100vw` on inner containers — causes horizontal overflow when a scrollbar is present. Use `width: 100%` instead.
- Apply `overflow-x: hidden` on `.shell__body` to prevent accidental layout bleed.
- All icon assets must have explicit `width` and `height` attributes to prevent layout shift (CLS).

---

## 12. Token Usage Rules

1. **CSS files:** Always reference brand colors via CSS variables (`var(--Primary)`, `var(--color-border)`). Never hard-code a hex value in a new `.css` file.
2. **TSX / MUI files:** Use `theme` palette values or `sx` props that reference `theme.palette.*`. Avoid inline `style={{ color: '#243a5e' }}`.

> ⚠️ **Tailwind `bg-[var()]` reliability issue:** In some build configurations, Tailwind's arbitrary-value syntax for background colors (`bg-[var(--Custom)]`) does not produce a `background-color` declaration — only border/ring utilities using the same variable work correctly. **Workaround:** When a CSS-variable background is critical and Tailwind fails, apply it via an inline `style` prop: `style={{ backgroundColor: "var(--Highlight)" }}`. This pattern is used for the login page role-selector buttons in `components/LoginForm.tsx`.
3. **New colors:** Add to `tokens.color` → expose in `cssVars` → reference via `var(--color-*)`. Do not skip any step.
4. **Spacing:** Use only values from the 8px-base scale (4, 8, 12, 16, 20, 24, 32, 40, 48, 64px). Document any exception here.
5. **Border-radius assignments:** containers → `28px`, buttons → `14px`, pills → `18px`, inputs → `8px`, avatars → `50%`.
6. **Font sizes:** Must map to a MUI typography variant. Exceptions must be documented in §3.3.
7. **Shell wrappers:** `.shell__body`, `.side-nav`, `.topnav` are structural — never modify for page-level styling.
8. **Button text colors on colored backgrounds:** always verify WCAG contrast before setting `color: white` on a non-dark background.

---

*End of TutorToise Design System Styling Guidelines*
