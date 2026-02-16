'use client'

import { createContext } from "react";

type ModalContextData = {
    isOpen: boolean,
    setIsOpen: (value: boolean) => void
};

export const ModalContext = createContext(
    {isOpen: false} as ModalContextData
);

