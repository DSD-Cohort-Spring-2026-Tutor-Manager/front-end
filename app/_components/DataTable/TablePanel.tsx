import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import DataTable from "./DataTable";

interface Session {
  id: string;
  date: string;
  student: string;
  subject: string;
  duration: string;
  time: string;
  status: "upcoming" | "completed";
}

interface Props {
  sessions: Session[];
  type: "upcoming" | "completed";
}

const sessions: Session[] = [
  {
    id: "1",
    date: "2026-02-21",
    student: "Emma Johnson",
    subject: "Mathematics",
    duration: "60 mins",
    time: "10:00 AM",
    status: "upcoming",
  },
  {
    id: "2",
    date: "2026-02-19",
    student: "Liam Smith",
    subject: "Science",
    duration: "45 mins",
    time: "02:30 PM",
    status: "completed",
  },
  {
    id: "3",
    date: "2026-02-22",
    student: "Olivia Brown",
    subject: "English",
    duration: "30 mins",
    time: "04:00 PM",
    status: "upcoming",
  },
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const getSessionsByTab = () => {
    switch (value) {
      case 0:
        return sessions.filter((s) => s.status === "upcoming");
      case 1:
        return sessions.filter((s) => s.status === "completed");
      default:
        return sessions;
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} sx={{}}>
          <Tab
            label={`Upcoming Schedule (${sessions.filter((s) => s.status === "upcoming").length})`}
          />
          <Tab
            label={`Completed Schedule (${sessions.filter((s) => s.status === "completed").length})`}
          />
          <Tab label="Students" />
        </Tabs>
      </Box>

      <CustomTabPanel value={value} index={0}>
        <DataTable sessions={getSessionsByTab()} type="upcoming" />
      </CustomTabPanel>

      <CustomTabPanel value={value} index={1}>
        <DataTable sessions={getSessionsByTab()} type="completed" />
      </CustomTabPanel>

      <CustomTabPanel value={value} index={2}></CustomTabPanel>
    </Box>
  );
}
