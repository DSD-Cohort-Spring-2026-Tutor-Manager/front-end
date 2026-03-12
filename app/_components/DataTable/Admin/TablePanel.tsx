import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import DataTable from "./DataTable";
import { useEffect, useState } from "react";
import { TutortoiseClient } from "../../../_api/tutortoiseClient";
import { ParentRecord } from "../../../types/types";

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}
interface Props {
  parentHistory: ParentRecord[];
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
export default function BasicTabs({ parentHistory }: Props) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label={"Parents"} />
        </Tabs>
      </Box>

      {TAB_CONFIG.map((tab, index) => (
        <CustomTabPanel key={tab.type} value={value} index={index}>
          <DataTable parentHistory={parentHistory} />
        </CustomTabPanel>
      ))}
    </Box>
  );
}
