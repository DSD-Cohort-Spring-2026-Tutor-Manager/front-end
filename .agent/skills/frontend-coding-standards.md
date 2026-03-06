# Frontend Coding Standards
**Stack: React / Next.js**

---

## 1. Styling

- **No inline CSS** — Do not use inline `style={{}}` attributes when developing new features. All styling must use the project's established solution — **confirm the chosen approach in `.agent/context/` before writing any styles**, and do not mix styling strategies (e.g. do not combine Tailwind utility classes with CSS modules in the same component).
- **Consistency first** — Ensure symmetry and consistent spacing that aligns with surrounding components. Match padding, margin, font sizes, and layout rhythm to the existing page.
- **Reference style guidelines** — Before building any new feature or component, review `style_guidelines` and the existing color scheme, token definitions, and component library. Do not introduce new colors, font sizes, or spacing values that aren't already defined.
- **Reference `.agent/` for development guidance** — Before developing any frontend feature, consult the files in the `.agent/` directory. It contains three subdirectories, each serving a distinct purpose:
  - **`context/`** — Project-specific background: architecture decisions, feature summaries, known constraints, and up-to-date notes on what has been built and why. Always read relevant context files before starting work on an existing feature.
  - **`skills/`** — Reusable patterns, conventions, and how-to guides specific to this codebase (e.g., how to build a form, how to call the API, how to structure a new page). Check here before solving a problem that's likely been solved before.
  - **`workflow/`** — Step-by-step processes for common development tasks: onboarding, feature development, debugging, deployment, etc. Follow these workflows rather than improvising your own process.
- **Keep `.agent/` up to date** — After any feature addition, change, or maintenance work, update the relevant files in `.agent/context/` to reflect what changed and why. If a new reusable pattern emerges, document it in `.agent/skills/`. If a process changes, update `.agent/workflow/`. This directory is the team's shared memory — keep it accurate.
- **No magic numbers** — Use design tokens or named constants for spacing, colors, and typography values rather than hard-coded pixel or hex values.

---

## 2. Component Development

- **Component colocation** — Keep component logic, styles, and tests close together in the same directory.
- **Single responsibility** — Each component should do one thing well. Extract sub-components when a component exceeds ~150 lines or handles more than one concern.
- **Props over internal state when possible** — Prefer lifting state up and passing props rather than duplicating state across sibling components.
- **Avoid prop drilling** — For deeply nested state, use React Context or the project's established state management solution rather than passing props through multiple layers.
- **Use TypeScript types/interfaces for all props** — Define explicit prop types. Avoid `any`.

---

## 3. Next.js Conventions

- **Use the appropriate rendering strategy** — Deliberately choose between SSR, SSG, ISR, and Client Components. Default to server-side where possible; only use `"use client"` when interactivity or browser APIs are required.
- **Keep `"use client"` boundaries as low as possible** — Push client components to the leaves of the component tree to maximize server rendering benefits.
- **Route handlers and API routes** — Follow the established pattern for API routes. Do not create new patterns without team alignment.

---

## 4. Data Fetching & API Calls

- **Do not change the data-fetching library** — Follow the team's established approach (e.g., `axios` vs `fetch`). Do not introduce a new library without explicit team discussion and approval.
- **Handle loading and error states** — Every async operation must account for loading, success, and error states. Never leave unhandled promise rejections.
- **No hardcoded API URLs** — Use environment variables for all API endpoints. Never commit secrets or credentials.
- **Environment hygiene** — Keep `.env.example` in sync with any new environment variables added. Never commit `.env.local` or any file containing real secrets. When adding a new variable, document its purpose in `.env.example` with a placeholder value.

---

## 5. Security

- **Validate all input** — Apply validation on both the client side (for UX) and server/API side (for correctness). Never trust user input.
- **Use null safety** — Apply optional chaining (`?.`) and nullish coalescing (`??`) to guard against undefined/null access errors.
- **Sanitize rendered content** — Never use `dangerouslySetInnerHTML` without explicitly sanitizing the input. Avoid it where possible.
- **Keep dependencies minimal and audited** — Do not add new `npm` packages without necessity and team review. Run `npm audit` before introducing a new dependency.

---

## 6. Dependencies & Configuration

- **Do not modify `package.json` unnecessarily** — Avoid adding, removing, or upgrading dependencies unless the change is required and planned.
- **Do not alter framework configuration** — Changes to `next.config.js`, `tsconfig.json`, `.eslintrc`, or similar files require explicit justification and team sign-off.
- **Pin or document version rationale** — If a dependency version is intentionally constrained, document why.

---

## 7. Code Quality & Safety

- **Linting and types are hard gates** — ESLint and TypeScript must pass with zero errors before any code is committed or a PR is opened. Warnings must be resolved, not suppressed with `// eslint-disable` or `@ts-ignore` unless there is a documented reason. A passing lint and type check is a minimum bar, not a nice-to-have.
- **No dead code** — Remove commented-out code, unused imports, and unused variables before committing.
- **No verbose or unnecessary comments** — Do not leave explanatory, redundant, or placeholder comments in committed code. Comments should only exist to explain *why* something non-obvious is done, not *what* the code does.
- **Avoid unnecessary re-renders** — Use `useMemo`, `useCallback`, and `React.memo` where profiling shows a benefit, but don't premature-optimize.
- **Accessibility by default** — Use semantic HTML. Ensure interactive elements have accessible labels. Test keyboard navigation for any new interactive component.

---

## 8. Change Process

For any change — no matter the size:

1. **Analyze** — Understand the full scope. Identify files, components, and tests affected.
2. **Plan** — Write out your approach and flag any risks or unknowns before touching code.
3. **Confirm** — For changes touching shared components, configuration files, API patterns, or anything affecting more than one feature, wait for explicit confirmation before implementing. Isolated, single-component bug fixes do not require a confirmation gate.
4. **Implement** — Make the change in small, logical steps.
5. **Verify** — Run linting, type checks, and tests. Manually test the affected UI path. Provide clear reasoning for every decision made.
7. **Update `.agent/`** — After any feature addition, change, or maintenance work, update the relevant files in `.agent/context/` to reflect what changed and why. If a new reusable pattern emerged, document it in `.agent/skills/`. If a process was modified, update `.agent/workflow/`.

---

## 9. Git & Commits

- **Follow the established commit pattern** — Reference the team's commit message format (e.g., `feat:`, `fix:`, `chore:`). Do not invent new conventions.
- **Branch naming** — Branches should follow the `feat/`, `fix/`, or `chore/` prefix convention in most cases (e.g., `feat/user-auth`, `fix/navbar-overflow`). Include a ticket reference where applicable.
- **Keep PRs minimal** — Scope each PR to a single feature, fix, or concern. Avoid bundling unrelated changes. Smaller PRs are easier to review and safer to merge.
- **Keep commits minimal** — Make frequent, focused commits. One logical change per commit. Avoid large all-in-one commits.
- **No WIP commits to main branches** — Work-in-progress code belongs on feature branches only.
- **Reference tickets** — Include issue or ticket references in commit messages where applicable.

### Pull Request Format

PR titles must match the regex: `^(chore|feat|fix): #\d+ .+$`

Format: `<type>: #<issue-number> <description>`

Examples:
- `feat: #12 add session booking modal`
- `fix: #7 resolve credit context type error`
- `chore: #3 update agent documentation`

PR body must follow this template exactly:

```markdown
## Issue ticket number and link
#<issue_number>

## Summary of app behaviour change
<brief description>

## Summary of code change
<brief description>

## Checklist before requesting a review
- [x] The title matches the regex `^(chore|feat|fix): #\d+ .+$`
- [x] The app builds, runs and functions locally, if applicable
```

---

## 10. Code Review Checklist

Before opening a PR, confirm:

- [ ] No inline styles introduced; established styling solution used consistently
- [ ] Spacing and layout consistent with the existing page
- [ ] Style guidelines and existing components referenced
- [ ] `.agent/context/`, `skills/`, or `workflow/` updated where applicable
- [ ] Input validated; null safety applied
- [ ] No new unnecessary dependencies added
- [ ] Data-fetching pattern follows team convention
- [ ] No hardcoded API URLs or secrets; `.env.example` updated if needed
- [ ] `"use client"` used only where necessary
- [ ] Loading and error states handled
- [ ] ESLint and TypeScript pass with zero errors; no suppressed warnings
- [ ] No dead code, debugging artifacts (`console.log`, etc.), or unnecessary comments
- [ ] Accessibility checked: semantic HTML, labels on interactive elements
- [ ] All props have explicit TypeScript types; no use of `any`
- [ ] Commit messages and branch name follow the established pattern
