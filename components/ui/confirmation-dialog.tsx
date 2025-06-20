import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  itemName: string;
  description?: string;
  consequences?: string[];
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  itemName,
  description,
  consequences,
  confirmText = 'Delete',
  cancelText = 'Cancel',
}: ConfirmationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle className='text-xl'>{title}</DialogTitle>
        </DialogHeader>
        <div className='py-4'>
          <p>{description || `Are you sure you want to delete "${itemName}"?`}</p>
          {consequences && consequences.length > 0 && (
            <div className='mt-2 text-sm text-gray-500'>
              <p>This will delete all associated data including:</p>
              <ul className='list-disc list-inside mt-1'>
                {consequences.map((consequence, index) => (
                  <li key={index}>{consequence}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <DialogFooter className='sm:justify-center gap-2'>
          <Button
            type='button'
            onClick={onClose}
            className='px-8 py-2 rounded-full bg-[#4285f4] text-white hover:bg-[#3367d6] transition-colors'
          >
            {cancelText}
          </Button>
          <Button
            type='button'
            onClick={onConfirm}
            className='px-8 py-2 rounded-full bg-[#ea4335] text-white hover:bg-[#d33828] transition-colors'
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
