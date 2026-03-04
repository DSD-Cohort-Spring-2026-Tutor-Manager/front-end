import { create } from "zustand";

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

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  token: null,
  isAuthenticated: false,

  setAuth: (user, role, token) => {
    // Set a lightweight cookie for middleware route enforcement (not the JWT itself).
    if (typeof document !== "undefined") {
      document.cookie = `tt_role=${role}; path=/; SameSite=Lax`;
    }
    set({ user, role, token, isAuthenticated: true });
  },

  clearAuth: () => {
    // Clear the role cookie
    if (typeof document !== "undefined") {
      document.cookie = "tt_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
    set({ user: null, role: null, token: null, isAuthenticated: false });
  },
}));
