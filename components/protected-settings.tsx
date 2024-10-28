'use client';

import React, { useEffect, useState } from 'react';
import { useMode } from '@/components/context/mode-context';
import { GlobalAppSettings } from '@/components/global-app-settings';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

export function ProtectedSettings() {
  const { enforceRoles, verifyPin, isParentMode, pin } = useMode();
  const { addToast } = useToast();
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (enforceRoles && !isParentMode && !isVerified) {
      const checkPin = async () => {
        if (!pin) {
          setIsVerified(true); // No PIN = automatic access
          return;
        }
        const inputPin = prompt('Enter PIN to access Settings:');
        if (inputPin && verifyPin(inputPin)) {
          setIsVerified(true);
        } else {
          addToast({
            title: 'Access Denied',
            description: 'Incorrect PIN. Settings access requires Parent mode.',
            variant: 'destructive',
          });
          router.push('/');
        }
      };
      checkPin();
    }
  }, [enforceRoles, isParentMode, isVerified, verifyPin, addToast, router, pin]);

  if (enforceRoles && !isParentMode && !isVerified) {
    return null;
  }

  return <GlobalAppSettings />;
}
