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
const TAB_CONFIG: { label: string; type: "parent" | "student" | "tutor" }[] = [
  { label: "Parents", type: "parent" },
  { label: "Students", type: "student" },
  { label: "Tutors", type: "tutor" },
];
export default function BasicTabs(props: any) {
  const [fullSessions, setFullSessions] = useState<any[]>([]);
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    TutortoiseClient.getSessionHistory().then((sessions) => {
      if (Array.isArray(sessions)) {
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

      {TAB_CONFIG.map((tab, index) => (
        <CustomTabPanel key={tab.type} value={value} index={index}>
          <DataTable sessions={fullSessions} type={tab.type} />
        </CustomTabPanel>
      ))}
    </Box>
  );
}
