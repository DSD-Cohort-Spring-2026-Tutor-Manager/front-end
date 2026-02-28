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

  useEffect(() => {
    TutortoiseClient.getSessionHistory().then((sessions) => {
      if (Array.isArray(sessions)) {
        console.log(sessions);
        setStudents([...new Set(sessions.map((s) => s.studentId))]);
        setTutors([...new Set(sessions.map((s) => s.tutorId))]);
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
  }, []);

  return (
    <main className="dashboard">
      <section className="dashboard__data-row" style={{ margin: "20px 20px" }}>
        <div className="databox-sm w-full h-80 bg-(--Primary) rounded-xl relative">
          <Databox title="Total Students" value={students.length} />
        </div>
        <div className="databox-sm w-full h-80 bg-(--Primary) rounded-xl relative">
          <Databox title="Total Tutors" value={tutors.length} />
        </div>
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
