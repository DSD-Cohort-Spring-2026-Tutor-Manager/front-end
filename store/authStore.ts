import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Role = "ADMIN" | "TUTOR" | "PARENT";

export interface AuthUser {
  id: string | number;
  email: string;
  name: string;
  [key: string]: unknown;
}

interface AuthState {
  user: AuthUser | null;
  role: Role | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  setHasHydrated: (val: boolean) => void;
  setAuth: (user: AuthUser, role: Role) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      hasHydrated: false,
      role: null,
      isAuthenticated: false,
      setAuth: (user: AuthUser, role: Role) =>
        set({ user, role, isAuthenticated: true }),
      setHasHydrated: (val) => set({ hasHydrated: val }),
      clearAuth: () => set({ user: null, role: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        // <-- add this
        state?.setHasHydrated(true);
      },
    },
  ),
);
