'use client';

import { createContext, useMemo, useState, useEffect } from 'react';
import { TutortoiseClient } from '../_api/tutortoiseClient';

type Props = {
  children: React.ReactNode;
};

export type ParentContextValue = {
  parentDetails: any;
  setParentDetails: (s: any) => void;
  addCredits: (amount: number) => void; // Add addCredits method to the context value
};

// A parent object with the added field 'selectedStudent' which will be used throughout the app
const defaultParentDetails = {
  // other fields populated from the API
  creditBalance: 0.0,
  students: [],
  selectedStudent: undefined,
};

export const ParentContext = createContext<ParentContextValue | null>(null);

export function ParentProvider({ children }: Props) {
  const [parentDetails, setParentDetails] = useState(defaultParentDetails);

  useEffect(() => {
    async function fetchParentDetails() {
      try {
        const data = await TutortoiseClient.getParentDetails(1);
        setParentDetails((prevDetails) => ({ ...prevDetails, ...data }));
      } catch (error) {
        console.error('Failed to fetch parent details:', error);
      }
    }

    fetchParentDetails();
  }, []);

  const addCredits = (amount: number) => {
    setParentDetails((prevDetails) => ({
      ...prevDetails,
      creditBalance: prevDetails.creditBalance + amount,
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
