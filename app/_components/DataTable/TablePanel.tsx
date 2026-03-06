import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import DataTable from "./DataTable";
import { useCallback, useEffect, useState } from "react";
import { TutortoiseClient } from "../../_api/tutortoiseClient";
import { useAuthStore } from "@/store/authStore";

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

function filterTutorSessions(sessions: any[], tutorName: string) {
  if (!Array.isArray(sessions) || !tutorName?.trim()) return { upcoming: [], completed: [] };
  const forTutor = sessions.filter((s) => s.tutorName === tutorName.trim());
  return {
    upcoming: forTutor.filter((s) => s.sessionStatus === "scheduled"),
    completed: forTutor.filter((s) => s.sessionStatus === "completed"),
  };
}

export default function BasicTabs(props: any) {
  const [completedSessions, setCompletedSessions] = useState<any[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([]);
  const [value, setValue] = React.useState(0);
  const user = useAuthStore((s:any) => s.user);
  const tutorName = user?.name ?? "";

  const fetchSessions = useCallback(() => {
    TutortoiseClient.getSessionHistory().then((sessions) => {
      const { upcoming, completed } = filterTutorSessions(sessions, tutorName);
      setUpcomingSessions(upcoming);
      setCompletedSessions(completed);
    });
  }, [tutorName]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleAssignGrade = useCallback(
    async (sessionId: string | number, grade: number) => {
      const tutorId =
        (user?.id != null ? Number(user.id) : NaN) ||
        upcomingSessions[0]?.tutorId ||
        1;
      await TutortoiseClient.assignGrade(
        Number(tutorId),
        Number(sessionId),
        grade,
      );
      fetchSessions();
    },
    [user?.id, upcomingSessions, fetchSessions],
  );

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

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
          onAssignGrade={handleAssignGrade}
        />
      </CustomTabPanel>

      <CustomTabPanel value={value} index={1}>
        <DataTable sessions={completedSessions} type="completed" />
      </CustomTabPanel>
    </Box>
  );
}
