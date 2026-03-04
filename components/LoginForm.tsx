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

      // Redirect based on role and (optional) redirect param
      const roleUpper = result.role!;
      const defaultDestination = ROLE_REDIRECTS[roleUpper] || "/";

      let destination = defaultDestination;

      if (redirectPath) {
        // Only trust redirectPath if it matches the role's allowed prefix.
        // This avoids bouncing users back to a URL they don't have access to.
        if (redirectPath.startsWith(defaultDestination)) {
          destination = redirectPath;
        }
      }

      router.push(destination);
    } catch {
      setServerError("Unable to reach the server. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[--Support] mb-1">
          Welcome back
        </h1>
        <p className="text-gray-500 text-sm">
          Sign in to your Tutortoise account
        </p>
      </div>

      {/* Role Selector */}
      <div className="flex gap-2 mb-8 p-1 bg-gray-100 rounded-xl">
        {(["parent", "tutor", "admin"] as Role[]).map((role) => (
          <button
            key={role}
            type="button"
            onClick={() => {
              setSelectedRole(role);
              setServerError("");
            }}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              selectedRole === role
                ? "bg-white shadow-sm text-[--Support]"
                : "text-gray-500 hover:text-gray-700 bg-transparent"
            }`}
          >
            {ROLE_LABELS[role]}
          </button>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register("email")}
            className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[--Highlight] transition ${
              errors.email
                ? "border-red-400 bg-red-50"
                : "border-gray-200 bg-white hover:border-gray-300"
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
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <a
              href="/login/forgot-password"
              className="text-xs text-[--Highlight] hover:text-[--Outlines] font-medium"
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
              className={`w-full px-4 py-3 pr-11 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[--Highlight] transition ${
                errors.password
                  ? "border-red-400 bg-red-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
              placeholder="Min. 8 characters"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0 bg-transparent hover:bg-transparent"
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
            className="flex items-start gap-3 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm"
          >
            <span className="mt-0.5">⚠</span>
            <span>{serverError}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-[--Support] text-white rounded-xl font-medium text-sm hover:bg-[--Outlines] active:scale-[0.99] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSubmitting
            ? "Signing in..."
            : `Sign in as ${ROLE_LABELS[selectedRole]}`}
        </button>
      </form>
    </div>
  );
}
