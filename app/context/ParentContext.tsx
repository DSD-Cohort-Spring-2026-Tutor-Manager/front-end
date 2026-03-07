'use client';

import {
  createContext,
  useMemo,
  useState,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
} from 'react';
import { useAuthStore } from '@/store/authStore';
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
  addCredits: (amount: number) => void;
};

const defaultParentDetails: ParentDetails = {
  creditBalance: 0.0,
  students: [],
  selectedStudent: null,
};

export const ParentContext = createContext<ParentContextValue | null>(null);

export function ParentProvider({ children }: Props) {
  const [parentDetails, setParentDetails] =
    useState<ParentDetails>(defaultParentDetails);

  const userId = useAuthStore((state) => state.user?.id);

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
  }, [userId]); 

  const addCredits = useCallback((amount: number) => {
    setParentDetails((prevDetails) => ({
      ...prevDetails,
      creditBalance: prevDetails.creditBalance + amount,
    }));
  }, []); 

  const value = useMemo(
    () => ({ parentDetails, setParentDetails, addCredits }),
    [parentDetails, addCredits],
  );

  return (
    <ParentContext.Provider value={value}>{children}</ParentContext.Provider>
  );
}