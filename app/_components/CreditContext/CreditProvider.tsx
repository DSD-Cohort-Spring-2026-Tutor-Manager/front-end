'use client';

import { useMemo, useState } from 'react';
import { CreditContext } from './CreditContext';

type Props = {
  children: React.ReactNode;
};

export default function CreditProvider({ children }: Props) {
  const [credits, setCredits] = useState(3);

  const addCredits = (num: number = 1) => setCredits((prev) => prev + num);

  const value = useMemo(() => ({ credits, addCredits }), [credits, addCredits]);

  return (
    <CreditContext.Provider value={value}>{children}</CreditContext.Provider>
  );
}
