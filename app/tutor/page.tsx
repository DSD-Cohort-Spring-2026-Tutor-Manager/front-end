"use client";
import "./dashboard.css";

import TablePanel from "../_components/DataTable/TablePanel";
import { useEffect, useRef, useState } from "react";
import { TutortoiseClient } from "../_api/tutortoiseClient";
import Databox from "../_components/DataBox/Databox";

function Home() {
  const [todaySessions, setTodaySessions] = useState<any[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([]);
  const [fullSessions, setFullSessions] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed">(
    "upcoming",
  );
  const tableSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    TutortoiseClient.getSessionHistory().then((sessions) => {
      if (Array.isArray(sessions)) {
        setUpcomingSessions(
          sessions.filter((s) => s.sessionStatus === "scheduled"),
        );
        setFullSessions(sessions);
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

  const handleView = (tab: "upcoming" | "completed") => {
    setActiveTab(tab);
    setTimeout(() => {
      tableSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  return (
    <main className="dashboard">
      <section className="dashboard__data-row" style={{ margin: "20px 20px" }}>
        <div className="databox-sm w-full h-80 bg-(--Primary) rounded-xl relative">
          <Databox
            title="Total Session"
            value={fullSessions.length}
            href="#table"
          />
        </div>
        <div className="databox-sm w-full h-80 bg-(--Primary) rounded-xl relative">
          <Databox
            title="Upcoming Session"
            value={upcomingSessions.length}
            href="#table"
          />
        </div>
        <div className="databox-sm w-full h-80 bg-(--Primary) rounded-xl relative">
          <Databox
            title="Today Session"
            value={todaySessions.length}
            href="#table"
          />
        </div>
      </section>

      <section ref={tableSectionRef} id="table" style={{ margin: "20px 0" }}>
        <TablePanel defaultTab={activeTab} />
      </section>
    </main>
  );
}

export default Home;
