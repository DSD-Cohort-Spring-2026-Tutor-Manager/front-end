# Parent Context Implementation

## Overview

This document outlines the changes made to the `ParentContext` and its integration into the `parent` directory of the front-end application. The goal of these changes was to improve type safety, eliminate redundancy, and ensure a single source of truth for parent-related data.

---

## Changes Made

### 1. **ParentContext (`app/context/ParentContext.tsx`):**

- **Typed Contract:**
  - Replaced `any` in `ParentContextValue` with a strongly typed contract using `Parent` and `Student` types from `types.ts`.
  - Defined a new `ParentDetails` type to represent the structure of `parentDetails`.

    ```typescript
    type ParentDetails = Partial<Parent> & {
      creditBalance: number;
      students: Student[];
      selectedStudent?: Student;
    };
    ```

- **Dynamic Parent ID:**
  - Modified the `ParentProvider` to accept a `parentId` prop and use it in the `fetchParentDetails` function.

    ```typescript
    export function ParentProvider({ children, parentId }: Props) {
      const [parentDetails, setParentDetails] = useState(defaultParentDetails);

      useEffect(() => {
        async function fetchParentDetails() {
          try {
            const data = await TutortoiseClient.getParentDetails(parentId);
            setParentDetails((prevDetails) => ({ ...prevDetails, ...data }));
          } catch (error) {
            console.error('Failed to fetch parent details:', error);
          }
        }

        fetchParentDetails();
      }, [parentId]);
    }
    ```

- **Add Credits Method:**
  - Added an `addCredits` method to update the `creditBalance` in `parentDetails`.

    ```typescript
    const addCredits = (amount: number) => {
      setParentDetails((prevDetails) => ({
        ...prevDetails,
        creditBalance: (prevDetails.creditBalance || 0) + amount,
      }));
    };
    ```

---

### 2. **Credits Page (`app/parent/credits/page.tsx`):**

- Removed the `CreditContext` import and its usage.
- Replaced `CreditContext` with `ParentContext` for managing and displaying `creditBalance`.
- Updated the `onClick` handler for the "Confirm" button to use the `addCredits` method from `ParentContext`.

---

### 3. **Dashboard Page (`app/parent/page.tsx`):**

- Integrated `creditBalance` from `ParentContext` to display the available credits on the dashboard.
- Removed `any` casts from input reads and replaced them with `HTMLInputElement | null`.

---

### 4. **Tutoring Page (`app/parent/tutoring/page.tsx`):**

- Replaced hardcoded `parentId` and `studentId` with values from `ParentContext`.
- Guarded `creditBalance` before performing arithmetic operations to prevent runtime errors.

---

## Benefits of Changes

1. **Improved Type Safety:**
   - Replacing `any` with typed contracts ensures that the structure of `parentDetails` is well-defined and consistent.

2. **Eliminated Redundancy:**
   - Removed the redundant `CreditContext` and consolidated credit-related data into `ParentContext`.

3. **Dynamic Data Fetching:**
   - Avoided hardcoding the parent ID, ensuring the correct data is fetched for the logged-in parent.

4. **Error Handling:**
   - Added guards to handle invalid or undefined `creditBalance` values, improving robustness.

---

## Next Steps

- Test the changes thoroughly to ensure that the application behaves as expected.
- Monitor for any edge cases or regressions in the functionality.
- Update documentation and onboarding materials to reflect the new `ParentContext` structure and usage.

---

This document serves as a reference for the changes made to the `ParentContext` and its integration into the `parent` directory. If you have any questions or need further clarification, please reach out to the development team.
