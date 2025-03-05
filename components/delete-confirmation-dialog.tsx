import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Delete User</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>Are you sure you want to delete the user "{itemName}"?</p>
          <div className="mt-2 text-sm text-gray-500">
            <p>This will delete all associated data including:</p>
            <ul className="list-disc list-inside mt-1">
              <li>Piggy bank account & transactions</li>
              <li>Task history</li>
              <li>User settings</li>
            </ul>
          </div>
        </div>
        <DialogFooter className="sm:justify-center gap-2">
          <Button
            type="button"
            onClick={onClose}
            className="px-8 py-2 rounded-full bg-[#4285f4] text-white hover:bg-[#3367d6] transition-colors"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            className="px-8 py-2 rounded-full bg-[#ea4335] text-white hover:bg-[#d33828] transition-colors"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
