'use client';

import React, { useEffect } from 'react';
import { useMode } from '@/components/context/mode-context';
import { GlobalAppSettings } from '@/components/global-app-settings';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

export function ProtectedSettings() {
  const { enforceRoles, verifyPin, isParentMode, pin, toggleParentMode } = useMode();
  const { addToast: toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const checkAccess = async () => {
      // If enforcement is off or already in parent mode, allow access
      if (!enforceRoles || isParentMode) {
        return;
      }

      // At this point, we're in child mode with enforcement on
      if (pin) {
        const inputPin = prompt('Enter PIN to access Settings:');
        if (inputPin && verifyPin(inputPin)) {
          await toggleParentMode();
        } else {
          router.push('/');
          toast({
            title: 'Access Denied',
            description: 'Incorrect PIN. Settings access requires Parent mode.',
            variant: 'destructive',
          });
        }
      } else {
        const success = await toggleParentMode();
        if (!success) {
          router.push('/');
          toast({
            title: 'Access Denied',
            description: 'Please switch to Parent mode to access Settings.',
            variant: 'destructive',
          });
        }
      }
    };

    checkAccess();
  }, [enforceRoles, isParentMode, pin, verifyPin, toggleParentMode, router, toast]); // Added dependencies

  // If enforcement is on and we're in child mode, show nothing
  if (enforceRoles && !isParentMode) {
    return null;
  }

  return <GlobalAppSettings />;
}
