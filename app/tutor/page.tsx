"use client";
import "./dashboard.css";

import TablePanel from "../_components/DataTable/TablePanel";
import { useEffect, useRef, useState } from "react";
import { TutortoiseClient } from "../_api/tutortoiseClient";
import Databox from "../_components/DataBox/Databox";
import { useAuthStore } from "@/store/authStore";

function filterTutorSessions(sessions: any[], tutorName: string) {
  if (!Array.isArray(sessions) || !tutorName?.trim()) return { upcoming: [], completed: [], full: [] };
  const forTutor = sessions.filter((s) => s.tutorName === tutorName.trim());
  return {
    upcoming:  forTutor.filter((s) => s.sessionStatus === "scheduled"),
    completed: forTutor.filter((s) => s.sessionStatus === "completed"),
    full:      forTutor,
  };
}

function Home() {
  const [todaySessions, setTodaySessions] = useState<any[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([]);
  const [fullSessions, setFullSessions] = useState<any[]>([]);
  const tableSectionRef = useRef<HTMLElement>(null);

  const user      = useAuthStore((s) => s.user);
  const tutorName = user?.name ?? "";

  useEffect(() => {
    if (!tutorName) return;

    TutortoiseClient.getSessionHistory().then((sessions) => {
      if (Array.isArray(sessions)) {
        const { upcoming, full } = filterTutorSessions(sessions, tutorName);

        setUpcomingSessions(upcoming);
        setFullSessions(full);
        setTodaySessions(
          upcoming.filter(
            (s) =>
              s.datetimeStarted?.split("T")[0] ===
              new Date().toISOString().split("T")[0],
          ),
        );
      }
    });
  }, [tutorName]);

  return (
    <main className="dashboard">
      <section className="dashboard__data-row" style={{ margin: "20px 20px" }}>
        <div className="databox-sm w-full h-80 bg-(--Primary) rounded-xl relative">
          <Databox title="Total Session" value={fullSessions.length} />
        </div>
        <div className="databox-sm w-full h-80 bg-(--Primary) rounded-xl relative">
          <Databox title="Upcoming Session" value={upcomingSessions.length} />
        </div>
        <div className="databox-sm w-full h-80 bg-(--Primary) rounded-xl relative">
          <Databox title="Today Session" value={todaySessions.length} />
        </div>
      </section>

      <section ref={tableSectionRef} id="table" style={{ margin: "20px 0" }}>
        <TablePanel />
      </section>
    </main>
  );
}

export default Home;