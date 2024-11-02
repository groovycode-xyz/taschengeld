'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useMode } from '@/components/context/mode-context';

interface PinSetupDialogProps {
  onSetPin: (pin: string) => void;
  existingPin?: string | null;
  buttonText?: string;
  dialogTitle?: string;
  className?: string;
}

export function PinSetupDialog({
  onSetPin,
  existingPin = null,
  buttonText = 'Configure PIN',
  dialogTitle = 'Configure Global PIN',
  className,
}: PinSetupDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [currentPin, setCurrentPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { verifyPin } = useMode();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // If changing existing PIN, verify current PIN first
    if (existingPin && !verifyPin(currentPin)) {
      setError('Current PIN is incorrect');
      return;
    }

    if (pin !== confirmPin) {
      setError('PINs do not match');
      return;
    }

    if (pin.length !== 4) {
      setError('PIN must be 4 digits');
      return;
    }

    onSetPin(pin);
    setIsOpen(false);
    setPin('');
    setConfirmPin('');
    setCurrentPin('');
  };

  return (
    <>
      <Button
        variant='outline'
        size='sm'
        onClick={() => setIsOpen(true)}
        className={`transition-all duration-200 ${className || ''}`}
      >
        {buttonText}
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className='space-y-4'>
            {existingPin && (
              <div className='space-y-2'>
                <Label htmlFor='currentPin'>Current PIN</Label>
                <div className='relative'>
                  <Input
                    id='currentPin'
                    type={showPin ? 'text' : 'password'}
                    value={currentPin}
                    onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder='Enter current PIN'
                    className='pr-10'
                    maxLength={4}
                    pattern='\d{4}'
                    required
                  />
                </div>
              </div>
            )}
            <div className='space-y-2'>
              <Label htmlFor='pin'>Enter PIN</Label>
              <div className='relative'>
                <Input
                  id='pin'
                  type={showPin ? 'text' : 'password'}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder='Enter 4-digit PIN'
                  className='pr-10'
                  maxLength={4}
                  pattern='\d{4}'
                  required
                />
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  className='absolute right-0 top-0 h-full px-3'
                  onClick={() => setShowPin(!showPin)}
                >
                  {showPin ? <EyeOffIcon className='h-4 w-4' /> : <EyeIcon className='h-4 w-4' />}
                </Button>
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='confirmPin'>Confirm PIN</Label>
              <div className='relative'>
                <Input
                  id='confirmPin'
                  type={showPin ? 'text' : 'password'}
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder='Confirm 4-digit PIN'
                  className='pr-10'
                  maxLength={4}
                  pattern='\d{4}'
                  required
                />
              </div>
            </div>
            {error && <p className='text-sm text-red-500'>{error}</p>}
            <DialogFooter>
              <Button type='button' variant='outline' onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type='submit'>Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
