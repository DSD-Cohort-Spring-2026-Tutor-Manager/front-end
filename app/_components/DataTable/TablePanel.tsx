import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import DataTable from './DataTable';
import { useCallback, useEffect, useState } from 'react';
import { TutortoiseClient } from '../../_api/tutortoiseClient';
import { useAuthStore } from '@/store/authStore';

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role='tabpanel' hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

interface BasicTabsProps {
  upcomingSessions: any[];
  completedSessions: any[];
  onTabChange?: (tabIndex: number) => void;
  onNoteSaved?: () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export default function BasicTabs({
  upcomingSessions,
  completedSessions,
  onTabChange,
  onNoteSaved,
}: BasicTabsProps) {
  const [value, setValue] = React.useState(0);
  const user = useAuthStore((s) => s.user);

  const handleAssignGrade = useCallback(
    async (sessionId: string | number, grade: number) => {
      await TutortoiseClient.assignGrade(
        Number(user?.id),
        Number(sessionId),
        grade,
      );
    },
    [user?.id],
  );

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    onTabChange?.(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label={'Upcoming Schedule'} />
          <Tab label={'Completed Schedule'} />
        </Tabs>
      </Box>

      <CustomTabPanel value={value} index={0}>
        <DataTable
          sessions={upcomingSessions}
          type='upcoming'
          onAssignGrade={handleAssignGrade}
          onNoteSaved={onNoteSaved}
        />
      </CustomTabPanel>

      <CustomTabPanel value={value} index={1}>
        <DataTable
          sessions={completedSessions}
          type='completed'
          onNoteSaved={onNoteSaved}
        />
      </CustomTabPanel>
    </Box>
  );
}
