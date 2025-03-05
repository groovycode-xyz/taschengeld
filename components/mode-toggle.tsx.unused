'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useMode } from '@/components/context/mode-context';
import { Lock, LockOpen } from 'lucide-react';

export function ModeToggle() {
  const { isParentMode, enforceRoles, toggleParentMode } = useMode();

  const handleToggle = async () => {
    const success = await toggleParentMode();
    if (!success && enforceRoles) {
      // PIN verification failed
      // We'll handle this with proper UI feedback later
    }
  };

  return (
    <Button
      variant='ghost'
      size='sm'
      onClick={handleToggle}
      disabled={!enforceRoles}
      className={`w-full justify-start gap-2 ${
        !enforceRoles ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      aria-label={isParentMode ? 'Switch to Child Mode' : 'Switch to Parent Mode'}
    >
      {isParentMode ? (
        <>
          <LockOpen className='h-4 w-4' />
          <span>Child Mode</span>
        </>
      ) : (
        <>
          <Lock className='h-4 w-4' />
          <span>Parent Mode</span>
        </>
      )}
      {!enforceRoles && (
        <span className='text-xs text-muted-foreground ml-2'>(Disabled in Settings)</span>
      )}
    </Button>
  );
}
