"use client";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { TutortoiseClient } from "../_api/tutortoiseClient";
import {
  Users,
  GraduationCap,
  UserCheck,
  CalendarDays,
  ChevronRight,
  AlertCircle,
  FileBarChart2,
  Activity,
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
      <span className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        {icon}
      </span>
      <div>
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{title}</p>
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

export default function AdminDashboard() {
  const user = useAuthStore((s) => s.user);
  const [students, setStudents] = useState<string[]>([]);
  const [tutors, setTutors] = useState<string[]>([]);
  const [totalSessions, setTotalSessions] = useState(0);
  const [bookedSessions, setBookedSessions] = useState(0);

  useEffect(() => {
    TutortoiseClient.getSessionHistory().then((sessions) => {
      if (Array.isArray(sessions)) {
        setStudents([...new Set(sessions.map((s: any) => s.studentId))]);
        setTutors([...new Set(sessions.map((s: any) => s.tutorId))]);
        setTotalSessions(sessions.length);
      }
    });
    TutortoiseClient.getAdminDetails().then((details) => {
      if (details) setBookedSessions(details.weeklySessionsBooked ?? 0);
    });
  }, []);

  return (
    <main className="dashboard p-6 space-y-6 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[--Support]">Admin Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Manage the Tutortoise platform</p>
      </div>

      {/* Stat Cards */}
      <section className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={students.length + tutors.length}
          icon={<Users className="w-6 h-6" />}
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="Active Tutors"
          value={tutors.length}
          icon={<GraduationCap className="w-6 h-6" />}
          color="bg-[--Primary] text-[--Outlines]"
        />
        <StatCard
          title="Active Parents"
          value={students.length}
          icon={<UserCheck className="w-6 h-6" />}
          color="bg-orange-50 text-orange-500"
        />
        <StatCard
          title="Sessions This Month"
          value={totalSessions}
          icon={<CalendarDays className="w-6 h-6" />}
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
            title="Manage Users"
            description="View, edit, and approve user accounts"
            href="/admin/users"
            icon={<Users className="w-5 h-5" />}
          />
          <ActionCard
            title="View All Sessions"
            description="Browse session history and schedules"
            href="/admin/sessions"
            icon={<CalendarDays className="w-5 h-5" />}
          />
          <ActionCard
            title="Platform Reports"
            description="Analytics, earnings, and usage reports"
            href="/admin/reports"
            icon={<FileBarChart2 className="w-5 h-5" />}
          />
        </section>

        {/* Notes Panel */}
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Platform Notes
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600">
                New registrations pending approval:{" "}
                <span className="font-semibold text-[--Support]">3</span>
              </span>
            </div>
            <div className="flex items-start gap-3">
              <FileBarChart2 className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600">
                Reports generated this week:{" "}
                <span className="font-semibold text-[--Support]">12</span>
              </span>
            </div>
            <div className="flex items-start gap-3">
              <Activity className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600">
                System health:{" "}
                <span className="font-semibold text-green-600">
                  All services operational
                </span>
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
