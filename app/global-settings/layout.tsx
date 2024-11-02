'use client';

import { useState } from 'react';
import { useMode } from '@/components/context/mode-context';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { AppShell } from '@/components/app-shell';
import { MainLayout } from '@/components/main-layout';

type AccessState = 'checking' | 'granted' | 'denied';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const { enforceRoles, verifyPin, isParentMode, pin, toggleParentMode } = useMode();
  const { addToast: toast } = useToast();
  const router = useRouter();
  const [accessState, setAccessState] = useState<AccessState>('checking');

  // Handle access check immediately during render
  if (accessState === 'checking') {
    // Allow access if enforcement is off or already in parent mode
    if (!enforceRoles || isParentMode) {
      setAccessState('granted');
      return null;
    }

    // At this point, we're in child mode with enforcement on
    if (pin) {
      const inputPin = prompt('Enter PIN to access Settings:');
      if (inputPin && verifyPin(inputPin)) {
        toggleParentMode();
        setAccessState('granted');
        toast({
          title: 'Parent Mode Activated',
          description: 'Successfully switched to Parent Mode',
          variant: 'default',
        });
      } else {
        router.push('/');
        toast({
          title: 'Access Denied',
          description: 'Incorrect PIN. Settings access requires Parent mode.',
          variant: 'destructive',
        });
        setAccessState('denied');
      }
    } else {
      toggleParentMode();
      setAccessState('granted');
      toast({
        title: 'Parent Mode Activated',
        description: 'Successfully switched to Parent Mode',
        variant: 'default',
      });
    }
    return null;
  }

  if (accessState === 'denied' || (enforceRoles && !isParentMode)) {
    return null;
  }

  return (
    <AppShell>
      <MainLayout>{children}</MainLayout>
    </AppShell>
  );
}
