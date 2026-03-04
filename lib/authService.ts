import axiosInstance from "@/lib/axios";
import { useAuthStore, type AuthUser, type Role } from "@/store/authStore";

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  role?: Role;
  user?: AuthUser;
}

/**
 * Login a user. btoa encoding is done here, never in the component.
 */
export async function login(
  email: string,
  password: string,
  role: "parent" | "tutor" | "admin"
): Promise<LoginResponse> {
  // IMPORTANT: credentials = btoa(email + ":" + password)
  const credentials = btoa(`${email}:${password}`);

  const response = await axiosInstance.post<LoginResponse>("/api/login", {
    email,
    credentials,
    role,
  });

  const data = response.data;

  if (data.success && data.token && data.role && data.user) {
    useAuthStore.getState().setAuth(data.user, data.role, data.token);
  }

  return data;
}

/**
 * Logout the current user.
 */
export async function logout(): Promise<void> {
  try {
    await axiosInstance.post("/api/auth/logout");
  } catch {
    // Ignore logout errors — always clear local state
  } finally {
    useAuthStore.getState().clearAuth();
  }
}

/**
 * Get current authenticated user profile.
 */
export async function getMe(): Promise<AuthUser | null> {
  try {
    const response = await axiosInstance.get<AuthUser>("/api/me");
    return response.data;
  } catch {
    return null;
  }
}
