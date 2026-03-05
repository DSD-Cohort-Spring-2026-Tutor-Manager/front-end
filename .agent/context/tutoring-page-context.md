# /parent/tutoring - Feature Context

## Architecture & Data Flow
The `/parent/tutoring/page.tsx` page uses a CSS grid layout (`className='tutoring'`) and consists of:
- **Navigation Area**: A student selector dropdown and the `CreditsViewBar` (which displays live credit balance from `CreditContext`).
- **Data Table**: An `AvailableSessionsTable` that displays a list of sessions. The table utilizes an `onJoin` callback to act upon the `SessionRow` object.
- **SessionRow Data**: Contains `id`, `date`, `tutor`, `subject`, and `time`.

## Feature Built: Booking Confirmation Modal
- **Component Extensibility**: Extended `app/_components/Modal/Modal.tsx` to accept an optional `children` prop. This allows entirely custom modal bodies (like our booking text) without breaking existing fallback modals and specifically avoids breaking the `type='add student'` conditional structure used on the parent dashboard.
- **Local State Management**: Added `isBookingModalOpen` (boolean) and `selectedSession` (`SessionRow` object) states directly to `page.tsx` to control visibility and inject dynamic data into the modal content.
- **Styling Details**:
  - The Modal title relies on the existing `.add-student-modal_header` class (from `Modal.css`) to perfectly match the size, color (`#2E6F5E`), and weight of the existing dashboard modals. 
  - Text utility classes (`text-center` and standard Tailwind sizes) were used on the body paragraphs to mirror the precise formatting requested.
  - Instead of Tailwind hacks, the buttons are seamlessly injected through the Modal's `children` property using the exact CSS classes `.add-student-modal-buttons`, `.modal-button`, `.add-student-confirm-button`, and `.add-student-cancel-button` from the base CSS. This guarantees perfect 1:1 matching in size, internal spacing, and color hexes with the add student modal. The default `buttons` prop is gracefully bypassed by supplying an empty array.

## Design Decisions
1. **Extending `Modal.tsx` over Adding Types**: We used `children` injection in `Modal.tsx` instead of adding a new hardcoded `type="booking confirm"`. This keeps the base Component clean, prevents infinite logic branching, and maximizes code reuse since the customized data and layout are fully controlled by the specific consumer page.
2. **Local State Preference**: Decided to manage the modal strictly within `parent/tutoring/page.tsx` instead of the global `ModalContext`. This directly couples the `selectedSession` detail object cleanly with the open/close state without bloating global stores.
3. **Fail-Safe UI Flow**: On clicking "Confirm", the application calls `TutortoiseClient.bookSession(1, 1, sessionId)` (temporarily hardcoding relation IDs). If successful, 1 token is subtracted directly from `CreditContext` (via the `addCredits(-1)` method). The modal aggressively closes on both confirmation and failure to never trap users helplessly on the screen.

## Recent Fixes
- **Context Type Error**: Resolved a build failure caused by attempting to destructure `setCredits` from the `CreditContext`. The fix safely utilizes the existing `addCredits(-1)` function to compute the new balance relative to the current amount, preventing unnecessary bloat on the global provider interface.
- **SonarQube Quality Gate (React Hook Naming)**: Fixed a SonarQube error where the functional component was named with a lowercase letter (`function page()`). React requires components utilizing hooks (like `useState`, `useContext`) to be capitalized. Renamed to `function Page()`.

## Key Learnings & Agent Constraints
- **Testing Before Pushing**: Always verify changes by running a local build (`npm run build`) *before* pushing commits to avoid causing build failures or triggering CI/CD alerts prematurely, even for seemingly trivial fixes.
- **GitHub PR Standards**: Strict PR title formatting (`^(chore|feat|fix): #\d+ .+$`) and specific markdown body templates are required. This process is now documented in `.agent/skills/tutortoise_github.md`.

## TODOs & Backlog
- **[TODO] Dynamic Relationships**: The `bookSession` API currently hardcodes `parentId: 1` and `studentId: 1`. Once dynamic student selection states are hooked up to the top dropdown menu, parameterize this call to use the actively selected variables.
- **[TODO] Unified Error Handling**: Currently, if the `bookSession` API call fails, the modal simply closes after logging the error. We need a uniform approach across the app to notify users of API failures (e.g., triggering a global Error Alert, toast notification, or utilizing local error states).
