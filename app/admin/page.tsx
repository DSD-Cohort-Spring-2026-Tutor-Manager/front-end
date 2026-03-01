"use client";
import "./dashboard.css";

import TablePanel from "../_components/DataTable/Admin/TablePanel";
import { useEffect, useRef, useState } from "react";
import { TutortoiseClient } from "../_api/tutortoiseClient";
import Databox from "../_components/DataBox/Databox";

function Home() {
  const [todaySessions, setTodaySessions] = useState<any[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([]);
  const [fullSessions, setFullSessions] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [tutors, setTutors] = useState<any[]>([]);
  const tableSectionRef = useRef<HTMLElement>(null);
  const [bookedSessions, setBookedSessions] = useState<number>(0);
  const [weeklyCreditsSold, setWeeklyCreditsSold] = useState<number>(0);
  const [parentId, setParentId] = useState<string>("0");

  useEffect(() => {
    TutortoiseClient.getSessionHistory().then((sessions) => {
      if (Array.isArray(sessions)) {
        setStudents([...new Set(sessions.map((s) => s.studentId))]);
        setTutors([...new Set(sessions.map((s) => s.tutorId))]);
        setParentId(sessions.find((s) => s.parentId)?.parentId);
        setUpcomingSessions(
          sessions.filter((s) => s.sessionStatus === "scheduled"),
        );
        setFullSessions(sessions.filter((s) => s));
        setTodaySessions(
          sessions.filter(
            (s) =>
              s.datetimeStarted?.split("T")[0] ===
              new Date().toISOString().split("T")[0],
          ),
        );
      }
    });
    TutortoiseClient.getAdminDetails().then((details) => {
      if (details) {
        setBookedSessions(details.weeklySessionsBooked);
        setWeeklyCreditsSold(details.weeklyCreditSold);
        console.log(details);
      }
    });
  }, []);

  return (
    <main className="dashboard">
      <section className="dashboard__data-row" style={{ margin: "20px 20px" }}>
        <Databox
          title="Credits Bought"
          subtitle="This Week"
          value={weeklyCreditsSold}
        />
        <Databox
          title="Sessions Full"
          subtitle="This Week"
          value={bookedSessions}
        />
        <Databox title="Total Students" value={students.length} />
        <Databox title="Total Session" value={fullSessions.length} />
      </section>

      <section ref={tableSectionRef} id="table" style={{ margin: "20px 0" }}>
        <TablePanel />
      </section>
    </main>
  );
}

export default Home;
