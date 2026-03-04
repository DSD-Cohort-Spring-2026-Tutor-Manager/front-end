"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldX, ArrowLeft, Home } from "lucide-react";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[--Primary] to-[--Off-white]">
      <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
            <ShieldX className="w-10 h-10 text-red-500" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-[--Support] mb-2">
          Access Denied
        </h1>
        <p className="text-6xl font-extrabold text-red-100 mb-4 select-none">
          403
        </p>
        <p className="text-gray-500 mb-8 leading-relaxed">
          You don&apos;t have permission to view this page. Please contact your
          administrator if you believe this is an error.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center gap-2 px-6 py-2 rounded-xl border border-[--Support] text-[--Support] bg-white hover:bg-[--Primary] transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 px-6 py-2 rounded-xl bg-[--Support] text-white hover:bg-[--Outlines] transition-colors text-sm font-medium"
          >
            <Home className="w-4 h-4" />
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
