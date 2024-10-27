'use client';

import React, { useEffect, useState } from 'react';
import { useMode } from '@/components/context/mode-context';
import { GlobalAppSettings } from '@/components/global-app-settings';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

export function ProtectedSettings() {
  const { enforceRoles, verifyPin, isParentMode } = useMode();
  const { addToast } = useToast();
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);

  // Add immediate check and redirect
  useEffect(() => {
    if (enforceRoles && !isParentMode && !isVerified) {
      const checkPin = async () => {
        const pin = prompt('Enter PIN to access Settings:');
        if (pin && verifyPin(pin)) {
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
  }, []); // Empty dependency array for initial check

  // Add effect to handle mode changes
  useEffect(() => {
    if (enforceRoles && !isParentMode) {
      router.push('/');
      addToast({
        title: 'Access Restricted',
        description: 'Settings access requires Parent mode.',
        variant: 'destructive',
      });
    }
  }, [enforceRoles, isParentMode, addToast, router]);

  // Don't render anything while checking or if access is denied
  if (enforceRoles && !isParentMode && !isVerified) {
    return null;
  }

  return <GlobalAppSettings />;
}
