'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ParentChildModeContextType {
  isParentMode: boolean;
  toggleMode: () => void;
}

const ParentChildModeContext = createContext<ParentChildModeContextType | undefined>(undefined);

export function ParentChildModeProvider({ children }: { children: ReactNode }) {
  const [isParentMode, setIsParentMode] = useState(true);

  useEffect(() => {
    const storedMode = localStorage.getItem('parentChildMode');
    setIsParentMode(storedMode === 'parent');
  }, []);

  const toggleMode = () => {
    const newMode = !isParentMode;
    setIsParentMode(newMode);
    localStorage.setItem('parentChildMode', newMode ? 'parent' : 'child');
  };

  return (
    <ParentChildModeContext.Provider value={{ isParentMode, toggleMode }}>
      {children}
    </ParentChildModeContext.Provider>
  );
}

export function useParentChildMode() {
  const context = useContext(ParentChildModeContext);
  if (context === undefined) {
    throw new Error('useParentChildMode must be used within a ParentChildModeProvider');
  }
  return context;
}
