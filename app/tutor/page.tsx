"use client";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { TutortoiseClient } from "../_api/tutortoiseClient";
import {
  CalendarDays,
  Users,
  Star,
  DollarSign,
  ChevronRight,
  Clock,
  BookOpen,
  UserRound,
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

export default function TutorDashboard() {
  const user = useAuthStore((s) => s.user);
  const firstName = user?.name?.split(" ")[0] ?? "Tutor";

  const [todaySessions, setTodaySessions] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);

  useEffect(() => {
    TutortoiseClient.getSessionHistory().then((sessions) => {
      if (Array.isArray(sessions)) {
        const tutorName = user?.name;
        const mySessionsAll = sessions.filter(
          (s: any) => !tutorName || s.tutorName === tutorName
        );
        const today = new Date().toISOString().split("T")[0];
        setTodaySessions(
          mySessionsAll.filter(
            (s: any) => s.datetimeStarted?.split("T")[0] === today
          ).length
        );
        setTotalStudents(
          new Set(mySessionsAll.map((s: any) => s.studentId)).size
        );
        setTotalSessions(mySessionsAll.length);
      }
    });
  }, [user]);

  return (
    <main className="dashboard p-6 space-y-6 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[--Support]">
          Welcome back, {firstName}
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Here&apos;s your schedule for today
        </p>
      </div>

      {/* Stat Cards */}
      <section className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Sessions Today"
          value={todaySessions}
          icon={<CalendarDays className="w-6 h-6" />}
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="Total Students"
          value={totalStudents}
          icon={<Users className="w-6 h-6" />}
          color="bg-[--Primary] text-[--Outlines]"
        />
        <StatCard
          title="Avg Rating"
          value="4.8"
          icon={<Star className="w-6 h-6" />}
          color="bg-yellow-50 text-yellow-500"
        />
        <StatCard
          title="Earnings This Month"
          value="$1,240"
          icon={<DollarSign className="w-6 h-6" />}
          color="bg-green-50 text-green-600"
        />
      </section>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <section className="lg:col-span-2 space-y-3">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Quick Actions
          </h2>
          <ActionCard
            title="Set Availability"
            description="Update your weekly schedule and time slots"
            href="/tutor/schedule"
            icon={<CalendarDays className="w-5 h-5" />}
          />
          <ActionCard
            title="View My Students"
            description="See all enrolled students and their progress"
            href="/tutor/students"
            icon={<Users className="w-5 h-5" />}
          />
          <ActionCard
            title="Session History"
            description="Review completed and upcoming sessions"
            href="/tutor/sessions"
            icon={<BookOpen className="w-5 h-5" />}
          />
        </section>

        {/* Notes Panel */}
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Today&apos;s Notes
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600">
                You have{" "}
                <span className="font-semibold text-[--Support]">
                  2 upcoming sessions
                </span>{" "}
                today
              </span>
            </div>
            <div className="flex items-start gap-3">
              <Bell className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600">
                <span className="font-semibold text-[--Support]">3</span> new
                booking requests pending
              </span>
            </div>
            <div className="flex items-start gap-3">
              <UserRound className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600">
                Your profile is{" "}
                <span className="font-semibold text-[--Support]">
                  80% complete
                </span>{" "}
                — add your bio
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
