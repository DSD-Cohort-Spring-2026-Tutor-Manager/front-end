import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import DataTable from "./DataTable";
import { useEffect, useState } from "react";
import { TutortoiseClient } from "../../../_api/tutortoiseClient";

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
  const getSessionsByTab = () => {
    switch (value) {
      case 0:
        return upcomingSessions;
      case 1:
        return completedSessions;

      default:
        return fullSessions;
    }
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
          <Tab label={"Parents"} />
          <Tab label={"Students"} />
          <Tab label={"Tutors"} />
        </Tabs>
      </Box>

      <CustomTabPanel value={value} index={0}>
        <DataTable sessions={getSessionsByTab()} type="parent" />
      </CustomTabPanel>

      <CustomTabPanel value={value} index={1}>
        <DataTable sessions={getSessionsByTab()} type="student" />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <DataTable sessions={getSessionsByTab()} type="tutor" />
      </CustomTabPanel>
    </Box>
  );
}
