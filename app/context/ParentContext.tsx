'use client';

import { createContext, useMemo, useState } from 'react';

type Props = {
    children: React.ReactNode;
};

export type ParentContextValue = {
    parentDetails: any;
    setParentDetails: (s: any) => void;
};

// A parent object with the added field 'selectedStudent' which will be used throughout the app
const defaultParentDetails = {
    // other fields populated from the API
    creditBalance: 0.0,
    students: [],
    selectedStudent: undefined
};

export const ParentContext = createContext<ParentContextValue | null>(null);

export function ParentProvider({ children }: Props) {
    const [parentDetails, setParentDetails] = useState(defaultParentDetails);

    const value = useMemo(() => ({ parentDetails, setParentDetails }), [parentDetails, setParentDetails]);

    return (
        <ParentContext.Provider value={value}>{children}</ParentContext.Provider>
    );
}
