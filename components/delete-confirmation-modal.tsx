import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trash2, X } from 'lucide-react';

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
        <p>{`Are you sure you want to delete the task "${taskTitle}"?`}</p>
        <div className="mt-4 flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
          <Button variant="destructive" onClick={onConfirmDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
