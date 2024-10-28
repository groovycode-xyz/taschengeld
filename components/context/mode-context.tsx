'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ModeContextType {
  enforceRoles: boolean;
  setEnforceRoles: (value: boolean) => void;
  isParentMode: boolean;
  setIsParentMode: (value: boolean) => void;
  hasFullAccess: boolean;
  pin: string | null;
  setPin: (pin: string | null) => void;
  verifyPin: (inputPin: string) => boolean;
  toggleParentMode: () => Promise<boolean>;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [enforceRoles, setEnforceRoles] = useState(true);
  const [isParentMode, setIsParentMode] = useState(true);
  const [pin, setPin] = useState<string | null>(null);
  const [isEnablingEnforcement, setIsEnablingEnforcement] = useState(false);
  const router = useRouter();

  // Modified state persistence
  useEffect(() => {
    const savedMode = localStorage.getItem('parentMode');
    const savedEnforceRoles = localStorage.getItem('enforceRoles');
    // Remove PIN from localStorage on initial load
    localStorage.removeItem('pin');

    if (savedEnforceRoles) setEnforceRoles(JSON.parse(savedEnforceRoles));
    if (savedMode) setIsParentMode(JSON.parse(savedMode));
    // Don't load saved PIN
  }, []);

  // Modified save state changes
  useEffect(() => {
    localStorage.setItem('parentMode', JSON.stringify(isParentMode));
    localStorage.setItem('enforceRoles', JSON.stringify(enforceRoles));
    // Only save PIN if explicitly set through setPin
    if (pin !== null) localStorage.setItem('pin', pin);
  }, [isParentMode, enforceRoles, pin]);

  // Change this to give full access when enforcement is disabled
  const hasFullAccess = !enforceRoles || isParentMode;

  const verifyPin = useCallback(
    (inputPin: string) => {
      if (!pin) return true; // Changed: if no PIN set, always allow access
      return inputPin === pin;
    },
    [pin]
  );

  const toggleParentMode = useCallback(async () => {
    if (!isParentMode) {
      // Switching to Parent mode
      if (enforceRoles && pin) {
        // Only check PIN if enforceRoles is true and PIN is set
        const inputPin = prompt('Enter PIN to access Parent mode:');
        if (!inputPin || !verifyPin(inputPin)) {
          return false;
        }
      }
      setIsParentMode(true);
      return true;
    } else {
      // Switching to Child mode - no verification needed
      setIsParentMode(false);
      return true;
    }
  }, [isParentMode, enforceRoles, pin, verifyPin]);

  // Modify the effect to respect the enabling process
  useEffect(() => {
    if (enforceRoles && !isParentMode && !isEnablingEnforcement) {
      if (window.location.pathname.includes('global-settings')) {
        router.push('/');
      }
    }
    // Reset the flag after the effect runs
    setIsEnablingEnforcement(false);
  }, [enforceRoles, isParentMode, router, isEnablingEnforcement]);

  const value = {
    enforceRoles,
    setEnforceRoles,
    isParentMode,
    setIsParentMode,
    hasFullAccess,
    pin,
    setPin,
    verifyPin,
    toggleParentMode,
  };

  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>;
}

export function useMode() {
  const context = useContext(ModeContext);
  if (context === undefined) {
    throw new Error('useMode must be used within a ModeProvider');
  }
  return context;
}
