"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./context/AuthContext";
import Image from "next/image";

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
      router.push("parent/");
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
      router.push("tutor/");
      return;
    }

    setError("Invalid credentials");
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-linear-to-br from-(--Primary) to-(--Off-white)">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="h-2 bg-(--Accent)"></div>

        <div className="p-8">
          <div className="flex flex-col items-center mb-6">
            <Image
              src="/images/worm_with_glasses.png"
              alt="Tutortoise Logo"
              className="w-14 h-14 mb-2"
              width="100"
              height="100"
            />
            <h1 className="text-xl font-semibold text-(--Support)">
              Tutortoise
            </h1>
            <p className="text-sm text-gray-500">Learning Center Portal</p>
          </div>
          <div className="flex justify-between mb-6 bg-gray-100 rounded-lg p-1">
            <label
              className={`flex-1 text-center py-2 rounded-md text-sm cursor-pointer transition ${
                role === "parent"
                  ? "bg-white shadow text-(--Support)"
                  : "text-gray-500"
              }`}
            >
              <input
                type="radio"
                name="role"
                value="parent"
                checked={role === "parent"}
                onChange={() => setRole("parent")}
                className="hidden"
              />
              Parent
            </label>

            <label
              className={`flex-1 text-center py-2 rounded-md text-sm cursor-pointer transition ${
                role === "tutor"
                  ? "bg-white shadow text-(--Support)"
                  : "text-gray-500"
              }`}
            >
              <input
                type="radio"
                name="role"
                value="tutor"
                checked={role === "tutor"}
                onChange={() => setRole("tutor")}
                className="hidden"
              />
              Tutor
            </label>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email address"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-(--Highlight)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-(--Highlight)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-(--Support) text-white hover:bg-(--Outlines) transition"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
