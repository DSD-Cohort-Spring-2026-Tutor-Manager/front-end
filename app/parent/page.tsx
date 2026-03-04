"use client";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { TutortoiseClient } from "../_api/tutortoiseClient";
import {
  GraduationCap,
  CalendarDays,
  Clock,
  BookOpen,
  ChevronRight,
  Search,
  Users,
  Bell,
  Lightbulb,
} from "lucide-react";
import Link from "next/link";
import "./dashboard.css";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
      <span
        className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}
      >
        {icon}
      </span>
      <div>
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
          {title}
        </p>
        <p className="text-2xl font-bold text-[--Support]">{value}</p>
      </div>
    </div>
  );
}

interface ActionCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

function ActionCard({ title, description, href, icon }: ActionCardProps) {
  return (
    <Link
      href={href}
      className="group bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:border-[--Highlight] hover:shadow-md transition-all duration-200 flex items-center justify-between"
    >
      <div className="flex items-center gap-4">
        <span className="w-10 h-10 rounded-xl bg-[--Primary] flex items-center justify-center text-[--Outlines]">
          {icon}
        </span>
        <div>
          <p className="font-semibold text-[--Support] text-sm">{title}</p>
          <p className="text-xs text-gray-400">{description}</p>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[--Highlight] transition-colors" />
    </Link>
  );
}

export default function ParentDashboard() {
  const user = useAuthStore((s) => s.user);
  const firstName = user?.name?.split(" ")[0] ?? "Parent";

  const [upcomingSessions, setUpcomingSessions] = useState(0);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [activeTutors, setActiveTutors] = useState(0);

  useEffect(() => {
    TutortoiseClient.getAllSessions().then((data) => {
      const allSessions = Array.isArray(data) ? data : (data?.sessions ?? []);
      setUpcomingSessions(
        allSessions.filter((s: any) => s.sessionStatus === "scheduled").length
      );
      setCompletedSessions(
        allSessions.filter((s: any) => s.sessionStatus === "completed").length
      );
      setActiveTutors(new Set(allSessions.map((s: any) => s.tutorId)).size);
    });
  }, []);

  return (
    <main className="dashboard p-6 space-y-6 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[--Support]">
          Welcome back, {firstName}
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Manage your child&apos;s learning journey
        </p>
      </div>

      {/* Stat Cards */}
      <section className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Active Tutors"
          value={activeTutors}
          icon={<GraduationCap className="w-6 h-6" />}
          color="bg-[--Primary] text-[--Outlines]"
        />
        <StatCard
          title="Upcoming Sessions"
          value={upcomingSessions}
          icon={<CalendarDays className="w-6 h-6" />}
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="Hours This Month"
          value={`${completedSessions * 1}h`}
          icon={<Clock className="w-6 h-6" />}
          color="bg-orange-50 text-orange-500"
        />
        <StatCard
          title="Subjects Enrolled"
          value="4"
          icon={<BookOpen className="w-6 h-6" />}
          color="bg-purple-50 text-purple-600"
        />
      </section>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <section className="lg:col-span-2 space-y-3">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Quick Actions
          </h2>
          <ActionCard
            title="Find a Tutor"
            description="Search verified tutors across 50+ subjects"
            href="/parent/search"
            icon={<Search className="w-5 h-5" />}
          />
          <ActionCard
            title="My Bookings"
            description="View and manage upcoming session bookings"
            href="/parent/sessions"
            icon={<CalendarDays className="w-5 h-5" />}
          />
          <ActionCard
            title="My Children"
            description="Manage student profiles and progress"
            href="/parent/children"
            icon={<Users className="w-5 h-5" />}
          />
        </section>

        {/* Notes Panel */}
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Updates
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <Bell className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600">
                You have{" "}
                <span className="font-semibold text-[--Support]">
                  1 session tomorrow
                </span>{" "}
                at 3:00 PM
              </span>
            </div>
            <div className="flex items-start gap-3">
              <BookOpen className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600">
                Tutor{" "}
                <span className="font-semibold text-[--Support]">
                  John Smith
                </span>{" "}
                submitted a progress report
              </span>
            </div>
            <div className="flex items-start gap-3">
              <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600">
                <span className="font-semibold text-[--Support]">Tip:</span>{" "}
                Book sessions in advance for best availability
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
