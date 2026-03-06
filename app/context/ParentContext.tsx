'use client';

import { createContext, useMemo, useState, useEffect, Dispatch, SetStateAction } from 'react';
import { TutortoiseClient } from '../_api/tutortoiseClient';
import { Parent, Student } from '../types/types';

type Props = {
  children: React.ReactNode;
  parentId: number;
};

type ParentDetails = Partial<Parent> & {
  creditBalance: number;
  students: Student[];
  selectedStudent?: Student;
};

export type ParentContextValue = {
  parentDetails: ParentDetails;
  setParentDetails: Dispatch<SetStateAction<ParentDetails>>;
  addCredits: (amount: number) => void;
};

const defaultParentDetails: ParentDetails = {
  creditBalance: 0.0,
  students: [],
  selectedStudent: undefined,
};

export const ParentContext = createContext<ParentContextValue | null>(null);

export function ParentProvider({ children, parentId }: Props) {
  const [parentDetails, setParentDetails] = useState(defaultParentDetails);

  useEffect(() => {
    async function fetchParentDetails() {
      try {
        const data = await TutortoiseClient.getParentDetails(parentId);
        setParentDetails((prevDetails) => ({ ...prevDetails, ...data }));
      } catch (error) {
        console.error('Failed to fetch parent details:', error);
      }
    }

    fetchParentDetails();
  }, [parentId]);

  const addCredits = (amount: number) => {
    setParentDetails((prevDetails) => ({
      ...prevDetails,
      creditBalance: (prevDetails.creditBalance || 0) + amount,
    }));
  };

  const value = useMemo(
    () => ({ parentDetails, setParentDetails, addCredits }),
    [parentDetails, setParentDetails],
  );

  return (
    <ParentContext.Provider value={value}>{children}</ParentContext.Provider>
  );
}
