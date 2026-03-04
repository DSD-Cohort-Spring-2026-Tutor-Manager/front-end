"use client";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { TutortoiseClient } from "../_api/tutortoiseClient";
import {
  GraduationCap,
  CalendarDays,
  Clock,
  BookOpen,
  Search,
  Users,
  Bell,
  Lightbulb,
} from "lucide-react";
import {
  StatCard,
  ActionCard,
  DashboardLayout,
} from "../_components/Dashboard";
import "./dashboard.css";

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
    <DashboardLayout
      title={`Welcome back, ${firstName}`}
      subtitle="Manage your child's learning journey"
      stats={
        <>
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
        </>
      }
      actions={
        <>
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
        </>
      }
      notesTitle="Updates"
      notes={
        <>
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
        </>
      }
    />
  );
}
