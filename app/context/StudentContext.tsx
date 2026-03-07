'use client';

/**
 * @deprecated StudentContext is no longer used within the /parent route.
 * Student selection is now managed by ParentContext.parentDetails.selectedStudent.
 * This file is retained only in case other routes consume it. Do not add new
 * usages — migrate to ParentContext instead.
 */
import { createContext, useMemo, useState } from 'react';

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
