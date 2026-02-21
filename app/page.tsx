"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();

  const [role, setRole] = useState<"parent" | "tutor">("parent");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      role === "parent" &&
      email === "parent@example.com" &&
      password === "123456"
    ) {
      setUser({
        name: "Samantha Villanueva",
        avatar: "/images/worm_with_glasses.png",
        role: "parent",
      });
      router.push("parent/dashboard");
      return;
    }

    if (
      role === "tutor" &&
      email === "tutor@example.com" &&
      password === "123456"
    ) {
      setUser({
        name: "Tortoise Tutor",
        avatar: "/images/worm_with_glasses.png",
        role: "tutor",
      });
      router.push("tutor/dashboard");
      return;
    }

    setError("Invalid credentials");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--Primary)] to-[var(--Off-white)]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Accent Header Bar */}
        <div className="h-2 bg-[var(--Accent)]"></div>

        <div className="p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-6">
            <img
              src="/images/worm_with_glasses.png"
              alt="Tutortoise Logo"
              className="w-14 h-14 mb-2"
            />
            <h1 className="text-xl font-semibold text-[var(--Support)]">
              Tutortoise
            </h1>
            <p className="text-sm text-gray-500">Learning Center Portal</p>
          </div>

          {/* Role Selection */}
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setRole("parent")}
              className={`flex-1 py-2 rounded-md text-sm transition ${
                role === "parent"
                  ? "bg-white shadow text-[var(--Support)]"
                  : "text-gray-500"
              }`}
            >
              Parent
            </button>
            <button
              type="button"
              onClick={() => setRole("tutor")}
              className={`flex-1 py-2 rounded-md text-sm transition ${
                role === "tutor"
                  ? "bg-white shadow text-[var(--Support)]"
                  : "text-gray-500"
              }`}
            >
              Tutor
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email address"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--Highlight)]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--Highlight)]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-[var(--Support)] text-white hover:bg-[var(--Outlines)] transition"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
