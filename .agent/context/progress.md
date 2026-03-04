Login page responsive update — progress log

Date: 2026-03-03

Summary:
- Ensured left branding panel is visible on mobile by changing layout to stack on small screens.
- Left panel now uses `flex w-full lg:w-[40%]` so it appears above the form on small screens and to the left on large screens.
- Decorative background elements are now hidden on small screens (`hidden lg:block`) to reduce visual clutter and avoid overlap.
- Removed the duplicate mobile-only logo from the right panel to avoid repetition when the left panel is visible on mobile.
- Updated `app/globals.css` to correct design tokens and button CTA contrast (see earlier edits).
- Normalized Tailwind arbitrary `--` usages to use the `var(--NAME)` form across the login files.

Files changed:
- `app/login/page.tsx` — responsive stacking + decorative visibility + mobile logo removal
- `components/LoginForm.tsx` — tokenized classes, CTA contrast, focus rings, input borders
- `app/globals.css` — token corrections: `--Off-white`, `--color-border`, CTA text color and radii

How to preview:
1. Start dev server:

```bash
npm run dev
```

2. Open http://localhost:3000/login and resize the browser width to verify:
   - Small widths: branding panel (logo + tagline + features) appears above the form.
   - Large widths: branding panel appears on the left (40%) and the form on the right (60%).

Notes / next steps:
- Run Lighthouse / axe to validate WCAG contrast across the page.
- Optionally adjust the left-panel content density on mobile (e.g., hide the features list) if it's too verbose for small screens.
- Migrate remaining class patterns that embed CSS variables across the project to use the `var(--NAME)` syntax for consistency.

What I learned:
- The previous implementation intentionally hid the left panel on small screens; making it visible required layout switching from row to column and hiding large-screen-only decorations.
- Some files elsewhere still reference the old arbitrary var syntax and will need a project-wide normalization.

If you'd like, I can proceed to run a project-wide search-and-replace for arbitrary var usage and/or collapse the left-panel features on smaller screens.
