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
  // IMPORTANT: credentials = base64(email + ":" + password) with UTF‑8 support
  const encoder = new TextEncoder();
  const utf8 = encoder.encode(`${email}:${password}`);
  let binary = "";
  utf8.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  const credentials = btoa(binary);

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
