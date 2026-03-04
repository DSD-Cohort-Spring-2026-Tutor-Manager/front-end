import { Suspense } from "react";
import {
  GraduationCap,
  CalendarDays,
  BarChart3,
  CheckCircle2,
} from "lucide-react";
import LoginForm from "@/components/LoginForm";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In — Tutortoise",
  description:
    "Sign in to your Tutortoise account to manage tutoring sessions.",
};

const features = [
  {
    icon: GraduationCap,
    text: "Find verified tutors across 50+ subjects",
  },
  {
    icon: CalendarDays,
    text: "Flexible scheduling that fits your lifestyle",
  },
  {
    icon: BarChart3,
    text: "Track progress with real-time session reports",
  },
];

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* ── Left Panel (40%) — Branding ── */}
      <div className="hidden lg:flex lg:w-[40%] flex-col justify-between bg-[--Support] text-white p-10 relative overflow-hidden">
        {/* Decorative background circles */}
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-white/5" />
        <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute top-1/2 -left-12 w-48 h-48 rounded-full bg-[--Highlight]/10" />

        {/* Logo + Wordmark */}
        <div className="relative z-10 flex items-center gap-3">
          <Image
            src="/images/worm_with_glasses.png"
            alt="Tutortoise logo"
            width={44}
            height={44}
            className="rounded-xl"
          />
          <span className="text-xl font-bold tracking-tight">Tutortoise</span>
        </div>

        {/* Tagline + Features */}
        <div className="relative z-10">
          <h2 className="text-3xl font-bold leading-tight mb-2">
            Connecting learners with the right tutors
          </h2>
          <p className="text-white/60 text-sm mb-10">
            Trusted by families and educators across the country.
          </p>

          <ul className="space-y-5">
            {features.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-4">
                <span className="flex-shrink-0 w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center mt-0.5">
                  <Icon className="w-5 h-5 text-[--Highlight]" />
                </span>
                <span className="text-sm text-white/80 leading-relaxed">
                  {text}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Trust badge */}
        <div className="relative z-10 flex items-center gap-3 p-4 bg-white/10 rounded-xl border border-white/10 backdrop-blur-sm">
          <CheckCircle2 className="w-5 h-5 text-[--Highlight] flex-shrink-0" />
          <p className="text-xs text-white/70 leading-relaxed">
            <span className="text-white font-semibold">10,000+ sessions</span>{" "}
            booked. Verified tutors reviewed by our team before approval.
          </p>
        </div>
      </div>

      {/* ── Right Panel (60%) — Login Form ── */}
      <div className="flex-1 flex flex-col items-center justify-center bg-[--Off-white] px-6 py-12">
        {/* Mobile-only logo */}
        <div className="flex lg:hidden items-center gap-2 mb-10">
          <Image
            src="/images/worm_with_glasses.png"
            alt="Tutortoise logo"
            width={36}
            height={36}
            className="rounded-lg"
          />
          <span className="text-lg font-bold text-[--Support]">Tutortoise</span>
        </div>

        <Suspense fallback={<div className="w-full max-w-md animate-pulse h-96 bg-white rounded-2xl" />}>
          <LoginForm />
        </Suspense>

        <p className="mt-8 text-xs text-gray-400">
          © {new Date().getFullYear()} Tutortoise. All rights reserved.
        </p>
      </div>
    </div>
  );
}
