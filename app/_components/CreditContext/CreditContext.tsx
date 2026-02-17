'use client';

import { createContext } from 'react';

export type CreditContextValue = {
  credits: number;
  addCredits: (arg0: number) => void;
};

export const CreditContext = createContext<CreditContextValue | null>(null);
