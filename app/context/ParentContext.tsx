'use client';

import {
  createContext,
  useMemo,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from 'react';
import { TutortoiseClient } from '../_api/tutortoiseClient';
import { Parent, Student } from '../types/types';
import { useAuthStore } from '../../store/authStore';

type Props = {
  children: React.ReactNode;
  parentId?: number;
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

  // read auth store for fallback parent id
  const authUserId = useAuthStore((s) => s.user?.id);

  const effectiveParentId = (() => {
    if (typeof parentId === 'number' && !isNaN(parentId)) return parentId;
    if (typeof authUserId === 'number' && !isNaN(authUserId)) return authUserId;
    if (typeof authUserId === 'string' && /^\d+$/.test(authUserId))
      return parseInt(authUserId, 10);
    return undefined;
  })();

  useEffect(() => {
    let active = true;

    async function fetchParentDetails(id: number) {
      try {
        const data = await TutortoiseClient.getParentDetails(id);
        if (active) {
          // Reset to default first to avoid stale fields from a previous account bleeding in
          setParentDetails({ ...defaultParentDetails, ...data });
        }
      } catch (error) {
        console.error('Failed to fetch parent details:', error);
      }
    }

    if (typeof effectiveParentId === 'number' && !isNaN(effectiveParentId)) {
      setParentDetails(defaultParentDetails); // clear stale state before fetch
      fetchParentDetails(effectiveParentId);
    } else {
      setParentDetails(defaultParentDetails);
    }

    return () => {
      active = false;
    };
  }, [effectiveParentId]);

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
