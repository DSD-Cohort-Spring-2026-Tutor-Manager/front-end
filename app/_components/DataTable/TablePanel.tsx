import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import DataTable from "./DataTable";
import { useEffect, useState } from "react";
import { TutortoiseClient } from "../../_api/tutortoiseClient";

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export default function BasicTabs(props: any) {
  const [completedSessions, setCompletedSessions] = useState<any[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([]);
  const [fullSessions, setFullSessions] = useState<any[]>([]);
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const handleCompleteSession = async (sessionId: string, notes: string) => {
    const storedSessions = JSON.parse(
      sessionStorage.getItem("sessions") || "[]",
    );

    const updatedSessions = storedSessions.map((s: any) =>
      s.sessionId === sessionId
        ? {
            ...s,
            sessionStatus: "completed",
            notes: notes,
          }
        : s,
    );
    sessionStorage.setItem("sessions", JSON.stringify(updatedSessions));
    setCompletedSessions(
      updatedSessions.filter(
        (s: any) =>
          s.sessionStatus === "completed" && s.tutorName === "Tutor1 No1",
      ),
    );

    setUpcomingSessions(
      updatedSessions.filter(
        (s: any) =>
          s.sessionStatus === "scheduled" && s.tutorName === "Tutor1 No1",
      ),
    );

    setFullSessions(updatedSessions);
  };
  useEffect(() => {
    TutortoiseClient.getSessionHistory().then((sessions) => {
      if (Array.isArray(sessions)) {
        sessionStorage.setItem("sessions", JSON.stringify(sessions));
        setCompletedSessions(
          sessions.filter(
            (s) =>
              s.sessionStatus === "completed" && s.tutorName === "Tutor1 No1",
          ),
        );
        setUpcomingSessions(
          sessions.filter(
            (s) =>
              s.sessionStatus === "scheduled" && s.tutorName === "Tutor1 No1",
          ),
        );
        setFullSessions(sessions);
      }
    });
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label={"Upcoming Schedule"} />
          <Tab label={"Completed Schedule"} />
        </Tabs>
      </Box>

      <CustomTabPanel value={value} index={0}>
        <DataTable
          sessions={upcomingSessions}
          type="upcoming"
          onCompleteSession={handleCompleteSession}
          setSessions={setUpcomingSessions}
        />
      </CustomTabPanel>

      <CustomTabPanel value={value} index={1}>
        <DataTable sessions={completedSessions} type="completed" />
      </CustomTabPanel>
    </Box>
  );
}
