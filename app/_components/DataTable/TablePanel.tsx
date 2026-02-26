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

interface Props {
  defaultTab?: "upcoming" | "completed";
}

export default function BasicTabs({ defaultTab = "upcoming" }: Props) {
  const [completedSessions, setCompletedSessions] = useState<any[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([]);
  const [fullSessions, setFullSessions] = useState<any[]>([]);
  const [value, setValue] = useState(defaultTab === "completed" ? 1 : 0);

  // Sync tab when defaultTab prop changes (e.g. clicked from dashboard)
  useEffect(() => {
    setValue(defaultTab === "completed" ? 1 : 0);
  }, [defaultTab]);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    TutortoiseClient.getSessionHistory().then((sessions) => {
      if (Array.isArray(sessions)) {
        setCompletedSessions(
          sessions.filter((s) => s.sessionStatus === "completed"),
        );
        setUpcomingSessions(
          sessions.filter((s) => s.sessionStatus === "scheduled"),
        );
        setFullSessions(sessions);
      }
    });
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Upcoming Schedule" />
          <Tab label="Completed Schedule" />
        </Tabs>
      </Box>

      <CustomTabPanel value={value} index={0}>
        <DataTable sessions={upcomingSessions} type="upcoming" />
      </CustomTabPanel>

      <CustomTabPanel value={value} index={1}>
        <DataTable sessions={completedSessions} type="completed" />
      </CustomTabPanel>
    </Box>
  );
}
