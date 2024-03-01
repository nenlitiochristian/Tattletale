import React, { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from "react";

type DarkModeContextType = {
    isDarkMode: boolean,
    setDarkMode: Dispatch<SetStateAction<boolean>>
};

export const DarkModeContext = createContext<DarkModeContextType | null>(null);

export const useDarkModeContext = () => {
    const context = useContext(DarkModeContext);

    if (!context) {
        throw new Error('useDarkModeContext must be inside a dark mode context provider')
    }

    return context
}