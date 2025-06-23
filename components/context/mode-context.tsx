'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSettings } from './settings-context';
import { PinDialog } from '@/components/ui/pin-dialog';

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
  pinDialogOpen: boolean;
  setPinDialogOpen: (open: boolean) => void;
  verifyPinSecure: (pin: string) => Promise<boolean>;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const { settings, updateSetting, isLoading } = useSettings();
  const [isParentMode, setIsParentMode] = useState(true);
  const [pinDialogOpen, setPinDialogOpen] = useState(false);
  const router = useRouter();

  const hasFullAccess = !settings.enforce_roles || isParentMode;

  const verifyPin = useCallback(
    (inputPin: string) => {
      if (!settings.parent_mode_pin) return true;
      return inputPin === settings.parent_mode_pin;
    },
    [settings.parent_mode_pin]
  );

  const verifyPinSecure = useCallback(async (pin: string) => {
    try {
      const response = await fetch('/api/auth/verify-pin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pin }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setIsParentMode(true);
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('PIN verification failed:', error);
      return false;
    }
  }, []);

  const toggleParentMode = useCallback(async () => {
    if (!isParentMode) {
      // Switching to Parent mode
      if (settings.enforce_roles && settings.parent_mode_pin) {
        // Open PIN dialog instead of using prompt
        setPinDialogOpen(true);
        return false; // Return false as verification will happen in dialog
      }
      setIsParentMode(true);
      return true;
    } else {
      // Switching to Child mode - check current path and redirect if necessary
      setIsParentMode(false);

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
    pinDialogOpen,
    setPinDialogOpen,
    verifyPinSecure,
  };

  // Optionally prevent render until initialized
  if (isLoading) {
    return null; // Or return a loading spinner
  }

  return (
    <ModeContext.Provider value={value}>
      {children}
      <PinDialog
        isOpen={pinDialogOpen}
        onClose={() => setPinDialogOpen(false)}
        onVerify={verifyPinSecure}
        title='Enter PIN'
        description='Please enter your PIN to switch to Parent mode.'
      />
    </ModeContext.Provider>
  );
}

export function useMode() {
  const context = useContext(ModeContext);
  if (context === undefined) {
    throw new Error('useMode must be used within a ModeProvider');
  }
  return context;
}
