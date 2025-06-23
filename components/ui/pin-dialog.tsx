'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PinDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (pin: string) => Promise<boolean>;
  title?: string;
  description?: string;
  isLoading?: boolean;
  error?: string;
}

export function PinDialog({
  isOpen,
  onClose,
  onVerify,
  title = 'Enter PIN',
  description = 'Please enter your PIN to switch to Parent mode.',
  isLoading = false,
  error,
}: PinDialogProps) {
  const [pin, setPin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setPin('');
      setLocalError(null);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!pin.trim()) {
      setLocalError('Please enter a PIN');
      return;
    }

    setIsSubmitting(true);
    setLocalError(null);

    try {
      const success = await onVerify(pin);
      if (success) {
        setPin('');
        onClose();
      } else {
        setLocalError('Invalid PIN. Please try again.');
      }
    } catch (error) {
      setLocalError('Verification failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const displayError = error || localError;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='pin'>PIN</Label>
            <Input
              id='pin'
              type='password'
              placeholder='Enter your PIN'
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSubmitting || isLoading}
              autoFocus
              maxLength={10}
              pattern='[0-9]*'
              inputMode='numeric'
              className={displayError ? 'border-red-500' : ''}
            />
            {displayError && <p className='text-sm text-red-600'>{displayError}</p>}
          </div>
        </form>

        <DialogFooter className='flex gap-2'>
          <Button variant='outline' onClick={onClose} disabled={isSubmitting || isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || isLoading || !pin.trim()}>
            {isSubmitting || isLoading ? 'Verifying...' : 'Verify PIN'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
