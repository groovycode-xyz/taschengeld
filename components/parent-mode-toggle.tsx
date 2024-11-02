'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useMode } from '@/components/context/mode-context';
import { Lock, LockOpen } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export function ParentModeToggle() {
  const { isParentMode, enforceRoles, toggleParentMode } = useMode();
  const { addToast } = useToast();

  const handleToggle = async () => {
    const success = await toggleParentMode();
    if (!success && enforceRoles) {
      addToast({
        title: 'Access Denied',
        description: 'Incorrect PIN. Please try again.',
        variant: 'destructive',
      });
    } else if (success) {
      addToast({
        title: isParentMode ? 'Child Mode Activated' : 'Parent Mode Activated',
        description: isParentMode ? 'Switched to Child Mode' : 'Successfully entered Parent Mode',
        variant: 'default',
      });
    }
  };

  return (
    <div className="mt-auto pt-4 border-t">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggle}
        disabled={!enforceRoles}
        className={`w-full justify-start gap-2 ${
          !enforceRoles ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        aria-label={isParentMode ? 'Switch to Child Mode' : 'Switch to Parent Mode'}
      >
        {isParentMode ? (
          <>
            <LockOpen className="h-4 w-4" />
            <span>Switch to Child Mode</span>
          </>
        ) : (
          <>
            <Lock className="h-4 w-4" />
            <span>Switch to Parent Mode</span>
          </>
        )}
        {!enforceRoles && <span className="text-xs text-muted-foreground ml-2">(Disabled)</span>}
      </Button>
    </div>
  );
}
