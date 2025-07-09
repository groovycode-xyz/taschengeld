'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSettings } from './settings-context';

interface ModeContextType {
  enforceRoles: boolean;
  setEnforceRoles: (value: boolean) => Promise<void>;
  isParentMode: boolean;
  setIsParentMode: (value: boolean) => void;
  hasFullAccess: boolean;
  pin: string | null;
  setPin: (pin: string | null) => Promise<void>;
  verifyPin: (inputPin: string) => boolean;
  toggleParentMode: () => Promise<boolean>;
  isInitialized: boolean;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const { settings, updateSetting, isLoading } = useSettings();
  const [isParentMode, setIsParentMode] = useState(() => {
    // Initialize from localStorage for device-specific persistence
    if (typeof window === 'undefined') return true;
    const stored = localStorage.getItem('mode-preference');
    return stored !== 'child'; // Default to parent mode if not explicitly child
  });
  const router = useRouter();

  const hasFullAccess = !settings.enforce_roles || isParentMode;

  const verifyPin = useCallback(
    (inputPin: string) => {
      if (!settings.parent_mode_pin) return true;
      return inputPin === settings.parent_mode_pin;
    },
    [settings.parent_mode_pin]
  );

  const toggleParentMode = useCallback(async () => {
    if (!isParentMode) {
      // Switching to Parent mode
      if (settings.enforce_roles && settings.parent_mode_pin) {
        const inputPin = prompt('Enter PIN to switch to Parent mode:');
        if (!inputPin || !verifyPin(inputPin)) {
          return false;
        }
      }
      setIsParentMode(true);
      // Persist mode preference to localStorage
      localStorage.setItem('mode-preference', 'parent');
      return true;
    } else {
      // Switching to Child mode - check current path and redirect if necessary
      setIsParentMode(false);
      // Persist mode preference to localStorage
      localStorage.setItem('mode-preference', 'child');

      // List of protected paths that require parent mode
      const protectedPaths = [
        '/global-settings',
        '/payday',
        '/task-management',
        '/user-management',
      ];

      // Check if current path is protected
      const currentPath = window.location.pathname;
      if (settings.enforce_roles && protectedPaths.some((path) => currentPath.includes(path))) {
        router.push('/');
        return true;
      }

      return true;
    }
  }, [isParentMode, settings.enforce_roles, settings.parent_mode_pin, verifyPin, router]);

  const setEnforceRoles = async (value: boolean) => {
    await updateSetting('enforce_roles', value);
  };

  const setPin = async (pin: string | null) => {
    await updateSetting('parent_mode_pin', pin);
  };

  // Sync with localStorage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'mode-preference' && e.newValue !== null) {
        setIsParentMode(e.newValue !== 'child');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const value: ModeContextType = {
    enforceRoles: settings.enforce_roles,
    setEnforceRoles,
    isParentMode,
    setIsParentMode,
    hasFullAccess,
    pin: settings.parent_mode_pin,
    setPin,
    verifyPin,
    toggleParentMode,
    isInitialized: !isLoading,
  };

  // Optionally prevent render until initialized
  if (isLoading) {
    return null; // Or return a loading spinner
  }

  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>;
}

export function useMode() {
  const context = useContext(ModeContext);
  if (context === undefined) {
    throw new Error('useMode must be used within a ModeProvider');
  }
  return context;
}
