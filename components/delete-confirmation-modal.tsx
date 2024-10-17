import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type DeleteConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: () => void;
  taskTitle: string;
};

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirmDelete,
  taskTitle,
}: DeleteConfirmationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Task</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to delete the task &quot;{taskTitle}&quot;?</p>
        <DialogFooter>
          <Button
            onClick={onClose}
            variant="secondary"
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirmDelete}
            variant="destructive"
            className="bg-red-600 hover:bg-red-700"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
