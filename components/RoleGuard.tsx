"use client";

// UI-only guard — authorization enforced server-side in Spring Security
import { useAuthStore, type Role } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface RoleGuardProps {
  role: Role[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * UI-only guard — authorization enforced server-side in Spring Security.
 * Redirects to /unauthorized if the current user's role is not in the allowed list.
 */
export default function RoleGuard({ role, children, fallback = null }: RoleGuardProps) {
  const currentRole = useAuthStore((s) => s.role);
  const router = useRouter();

  const isAllowed = currentRole !== null && role.includes(currentRole);

  useEffect(() => {
    if (currentRole !== null && !isAllowed) {
      router.replace("/unauthorized");
    }
  }, [currentRole, isAllowed, router]);

  if (!isAllowed) return <>{fallback}</>;

  return <>{children}</>;
}
