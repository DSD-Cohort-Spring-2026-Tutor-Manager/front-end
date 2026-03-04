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

  // Store the server-validated role and token only in memory.
  // Do not write tt_role to a client-writable cookie; middleware
  // should rely on the HttpOnly cookie set by the server.
  setAuth: (user, role, token) => {
    set({ user, role, token, isAuthenticated: true });
  },

  clearAuth: () => {
    set({ user: null, role: null, token: null, isAuthenticated: false });
  },
}));

