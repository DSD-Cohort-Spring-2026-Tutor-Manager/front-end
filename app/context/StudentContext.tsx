'use client';

import { createContext, useMemo, useState } from 'react';
import { CreditContext } from './CreditContext';

type Props = {
  children: React.ReactNode;
};

export type StudentContextValue = {
  student: any;
  setStudent: (s: any) => void;
};

const defaultStudent = {
  studentName: "Zayn",
  studentId: 7
};

export const StudentContext = createContext<StudentContextValue | null>(null);

export function StudentProvider({ children }: Props) {
  const [student, setStudent] = useState(defaultStudent);

  const value = useMemo(() => ({ student, setStudent }), [student, setStudent]);

  return (
    <StudentContext.Provider value={value}>{children}</StudentContext.Provider>
  );
}
