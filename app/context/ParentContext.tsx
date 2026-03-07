'use client';

import {
  createContext,
  useMemo,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from 'react';
import { useAuthStore } from '@/store/authStore';
import { usePathname } from 'next/navigation';
import { TutortoiseClient } from '../_api/tutortoiseClient';
import { Parent, Student } from '../types/types';

type Props = {
  children: React.ReactNode;
};

export type ParentDetails = Partial<Parent> & {
  creditBalance: number;
  students: Student[];
  selectedStudent?: Student | null;
};

export type ParentContextValue = {
  parentDetails: ParentDetails;
  setParentDetails: Dispatch<SetStateAction<ParentDetails>>;
  addCredits: (amount: number) => void; // Add addCredits method to the context value
};

// A parent object with the added field 'selectedStudent' which will be used throughout the app
const defaultParentDetails: ParentDetails = {
  // other fields populated from the API
  creditBalance: 0.0,
  students: [],
  selectedStudent: null,
};

export const ParentContext = createContext<ParentContextValue | null>(null);

export function ParentProvider({ children }: Props) {
  const [parentDetails, setParentDetails] =
    useState<ParentDetails>(defaultParentDetails);

  const userId = useAuthStore((state) => state.user?.id);
  const pathname = usePathname();

  useEffect(() => {
    async function fetchParentDetails() {
      if (!userId) return;

      const parentId = Number(userId);
      if (Number.isNaN(parentId)) {
        console.error('Invalid parent ID:', userId);
        return;
      }

      const data = await TutortoiseClient.getParentDetails(parentId);

      if (data === undefined) {
        console.error(
          'Failed to fetch parent details: response was undefined.',
        );
        return;
      }

      setParentDetails((prevDetails) => ({ ...prevDetails, ...data }));
    }

    fetchParentDetails();
  }, [userId, pathname]);

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
