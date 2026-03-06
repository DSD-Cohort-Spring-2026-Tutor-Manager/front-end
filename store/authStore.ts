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
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: AuthUser, role: Role, token: string) => void;
  clearAuth: () => void;
}



export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      role: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user: AuthUser, role: Role, token: string) => set({ user, role, token, isAuthenticated: true }),
      clearAuth: () => set({ user: null,role: null, token: null , isAuthenticated: false }),
    }),
    {
      name: "auth-storage",        // key in localStorage
      // storage: cookieStorage    // swap to cookie if needed
    }
  )
);

