"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { login } from "@/lib/authService";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormData = z.infer<typeof schema>;

type Role = "parent" | "tutor" | "admin";

const ROLE_LABELS: Record<Role, string> = {
  parent: "Parent",
  tutor: "Tutor",
  admin: "Admin",
};

const ROLE_REDIRECTS: Record<string, string> = {
  ADMIN: "/admin",
  TUTOR: "/tutor",
  PARENT: "/parent",
};

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect");

  const [selectedRole, setSelectedRole] = useState<Role>("parent");
  const [serverError, setServerError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setServerError("");
    try {
      const result = await login(data.email, data.password, selectedRole);

      if (!result.success) {
        // Show message from API — never a generic error
        setServerError(result.message || "Login failed");
        return;
      }

      // Redirect based on role
      const roleUpper = result.role!;
      const destination = redirectPath || ROLE_REDIRECTS[roleUpper] || "/";
      router.push(destination);
    } catch {
      setServerError("Unable to reach the server. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Heading */}
      <div className="mb-6 lg:mb-8 text-center lg:text-left">
        <h1 className="text-3xl lg:text-[2.5rem] font-bold text-[var(--Support)] mb-1 leading-tight">
          Welcome back
        </h1>
        <p className="text-[var(--Support)]/60 text-sm">
          Sign in to your Tutortoise account
        </p>
      </div>

      {/* Role Selector */}
      <div className="flex gap-2 mb-8 p-1 bg-[var(--Primary)]/20 rounded-[8px]">
        {(["parent", "tutor", "admin"] as Role[]).map((role) => {
          const isSelected = selectedRole === role;
          return (
            <button
              key={role}
              type="button"
              onClick={() => {
                setSelectedRole(role);
                setServerError("");
              }}
              aria-pressed={isSelected}
              aria-label={`${ROLE_LABELS[role]} role`}
              style={isSelected ? { backgroundColor: "var(--Highlight)" } : undefined}
              className={`flex-1 py-2 px-3 rounded-[14px] text-sm font-bold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--Highlight)]/40 ${
                isSelected
                  ? "text-[var(--Support)] shadow-sm"
                  : "text-[var(--Support)]/50 hover:text-[var(--Support)]/80 bg-transparent hover:bg-[var(--Primary)]/10"
              }`}
            >
              {ROLE_LABELS[role]}
            </button>
          );
        })}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-[var(--Support)] mb-1"
          >
            Email address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register("email")}
            className={`w-full px-4 py-3 border rounded-[8px] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--Highlight)]/60 focus:ring-offset-1 transition ${errors.email
              ? "border-red-400 bg-red-50"
              : "border-[var(--color-border)] bg-white hover:border-[var(--Outlines)]"
              }`}
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[var(--Support)]"
            >
              Password
            </label>
            <a
              href="/login/forgot-password"
              className="text-xs text-[var(--Highlight)] hover:text-[var(--Outlines)] font-medium"
            >
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              {...register("password")}
              className={`w-full px-4 py-3 pr-11 border rounded-[8px] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--Highlight)]/60 focus:ring-offset-1 transition ${errors.password
                ? "border-red-400 bg-red-50"
                : "border-[var(--color-border)] bg-white hover:border-[var(--Outlines)]"
                }`}
              placeholder="Min. 8 characters"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--Support)]/40 hover:text-[var(--Support)]/70 p-0 bg-transparent hover:bg-transparent"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Error Banner — shows message from API, never generic */}
        {serverError && (
          <div
            role="alert"
            className="flex items-start gap-3 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-[14px] text-sm"
          >
            <span className="mt-0.5">⚠</span>
            <span>{serverError}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-[var(--Highlight)] text-[var(--Support)] rounded-[14px] font-bold text-xl lg:text-2xl hover:bg-[var(--Accent)] active:scale-[0.99] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin text-[var(--Support)]" />}
          {isSubmitting
            ? "Signing in..."
            : `Sign in as ${ROLE_LABELS[selectedRole]}`}
        </button>
      </form>
    </div>
  );
}
