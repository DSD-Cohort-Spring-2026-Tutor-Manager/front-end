"use client";
import { createContext, useContext } from "react";
import { useAuthStore } from "@/store/authStore";
import { logout } from "@/lib/authService";

interface LegacyUser {
  name: string;
  avatar: string;
  role: "parent" | "tutor" | "admin";
}

/**
 * AuthContext — kept for backward compatibility with SideNav, TopNav, and other
 * components that consume useAuth(). Data now flows from Zustand (memory-only).
 * No localStorage — JWT and role live in the Zustand store.
 */
const AuthContext = createContext<{
  user: LegacyUser | null;
  setUser: (user: LegacyUser | null) => void;
}>({
  user: null,
  setUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Derive legacy user shape from Zustand store
  const zustandUser = useAuthStore((s) => s.user);
  const zustandRole = useAuthStore((s) => s.role);

  const legacyUser: LegacyUser | null =
    zustandUser && zustandRole
      ? {
          name: zustandUser.name,
          avatar: "/images/worm_with_glasses.png",
          role: zustandRole.toLowerCase() as LegacyUser["role"],
        }
      : null;

  const setUser = async (user: LegacyUser | null) => {
    if (!user) {
      await logout();
    }
  };

  return (
    <AuthContext.Provider value={{ user: legacyUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
