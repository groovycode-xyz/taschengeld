import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from 'components/ui/dialog';
import { Button } from 'components/ui/button';

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

export function DeleteConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  itemName,
}: DeleteConfirmationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete User</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the user &#34;{itemName}&#34;?
          </DialogDescription>
        </DialogHeader>
        <div className='py-3'>
          <p className='mb-2'>This will also delete:</p>
          <ul className='list-disc list-inside space-y-1 text-sm text-muted-foreground'>
            <li>Their piggy bank account and all transaction history</li>
            <li>Their completed tasks history</li>
            <li>All their associated data</li>
          </ul>
          <p className='mt-4 text-sm text-red-600'>This action cannot be undone.</p>
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant='outline'>
            Cancel
          </Button>
          <Button onClick={onConfirm} variant='destructive'>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
