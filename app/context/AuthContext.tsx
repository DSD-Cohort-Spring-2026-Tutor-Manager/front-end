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
      // Clear both backend session and in-memory auth state.
      await logout();
      return;
    }

    // When a legacy user is provided, hydrate the Zustand auth store so that
    // newer parts of the app see a consistent user/role.
    const roleUpper = user.role.toUpperCase() as
      | "PARENT"
      | "TUTOR"
      | "ADMIN";

    // We don't have a token in this legacy path, so pass an empty string.
    // Authorization is enforced server-side; this is for UI state only.
    const { setAuth } = useAuthStore.getState();
    setAuth(
      {
        id: "legacy",
        email: "",
        name: user.name,
      },
      roleUpper,
      "",
    );
  };

  return (
    <AuthContext.Provider value={{ user: legacyUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
