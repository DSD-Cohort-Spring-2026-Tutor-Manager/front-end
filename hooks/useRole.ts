import { useAuthStore } from "@/store/authStore";

export function useRole() {
  const role = useAuthStore((s) => s.role);

  return {
    role,
    isAdmin: role === "ADMIN",
    isTutor: role === "TUTOR",
    isParent: role === "PARENT",
  };
}
