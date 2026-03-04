"use client";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { TutortoiseClient } from "../_api/tutortoiseClient";
import {
  Users,
  GraduationCap,
  UserCheck,
  CalendarDays,
  AlertCircle,
  FileBarChart2,
  Activity,
} from "lucide-react";
import {
  StatCard,
  ActionCard,
  DashboardLayout,
} from "../_components/Dashboard";
import "./dashboard.css";

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
    <DashboardLayout
      title="Admin Dashboard"
      subtitle="Manage the Tutortoise platform"
      stats={
        <>
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
        </>
      }
      actions={
        <>
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
        </>
      }
      notesTitle="Platform Notes"
      notes={
        <>
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
        </>
      }
    />
  );
}

