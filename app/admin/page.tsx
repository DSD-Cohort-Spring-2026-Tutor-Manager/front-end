"use client";
import "./dashboard.css";

import TablePanel from "../_components/DataTable/Admin/TablePanel";
import { useEffect, useRef, useState } from "react";
import { TutortoiseClient } from "../_api/tutortoiseClient";
import Databox from "../_components/DataBox/Databox";
import { ParentRecord } from "../types/types";

function Home() {
  const tableSectionRef = useRef<HTMLElement>(null);
  const [parentHistory, setParentHistory] = useState<ParentRecord[]>([]);
  const [adminDetails, setAdminDetails] = useState<any>(null);

  useEffect(() => {
    TutortoiseClient.getAdminDetails().then((d) => d && setAdminDetails(d));
    TutortoiseClient.getParentHistory()
      .then(setParentHistory)
      .catch(() => {});
  }, []);
  console.log("adminDetails", adminDetails);
  return (
    <main className="dashboard">
      <section className="dashboard__data-row" style={{ margin: "20px 20px" }}>
        <Databox
          title="Credits Bought"
          subtitle="This Week"
          value={adminDetails?.weeklyCreditSold}
          lastValue={adminDetails?.lastWeeklyCreditSold}
        />
        <Databox
          title="Sessions Booked"
          subtitle="This Week"
          value={adminDetails?.weeklySessionsBooked}
          lastValue={adminDetails?.lastWeeklySessionsBooked}
        />
        <Databox
          title="Revenue in $"
          subtitle="This Week"
          value={adminDetails?.weeklyCashRevenue}
          lastValue={adminDetails?.lastWeeklyCashRevenue}
        />
        <Databox title="Total Parents" value={parentHistory.length} />
      </section>

      <section ref={tableSectionRef} id="table" style={{ margin: "20px 0" }}>
        <TablePanel parentHistory={parentHistory} />
      </section>
    </main>
  );
}

export default Home;
