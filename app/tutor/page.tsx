"use client";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { TutortoiseClient } from "../_api/tutortoiseClient";
import {
  CalendarDays,
  Users,
  Star,
  DollarSign,
  Clock,
  BookOpen,
  UserRound,
  Bell,
} from "lucide-react";
import {
  StatCard,
  ActionCard,
  DashboardLayout,
} from "../_components/Dashboard";
import "./dashboard.css";

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
    <DashboardLayout
      title={`Welcome back, ${firstName}`}
      subtitle="Here's your schedule for today"
      stats={
        <>
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
        </>
      }
      actions={
        <>
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
        </>
      }
      notesTitle="Today's Notes"
      notes={
        <>
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
        </>
      }
    />
  );
}
