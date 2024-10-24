import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CompletedTask } from '@/app/types/completedTask';
import { formatCurrency } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { IconComponent } from './icon-component';
import { SquareCheckBig } from 'lucide-react'; // Import the new icon

interface CompletedTaskCardProps {
  task: CompletedTask;
  onUpdateStatus: (cTaskId: number, newStatus: string) => void;
  isLoading: boolean;
}

export function CompletedTaskCard({ task, onUpdateStatus, isLoading }: CompletedTaskCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'Approve' | 'Reject' | null>(null);

  const handleAction = (action: 'Approve' | 'Reject') => {
    setActionType(action);
    setIsDialogOpen(true);
  };

  const confirmAction = () => {
    if (actionType) {
      onUpdateStatus(task.c_task_id, actionType + 'd');
    }
    setIsDialogOpen(false);
  };

  return (
    <Card className="rounded-lg shadow-md hover:shadow-lg transition-shadow bg-white">
      <CardHeader className="flex flex-row items-center space-x-2 p-4 bg-blue-50 rounded-t-lg">
        <SquareCheckBig className="h-6 w-6 text-green-500" /> {/* Add the new icon here */}
        <IconComponent icon={task.icon_name} className="h-6 w-6 text-blue-500" />
        <CardTitle className="text-blue-600">{task.task_title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-center space-x-2 mb-2">
          <IconComponent icon={task.user_icon} className="h-6 w-6 text-gray-500" />
          <span>Completed by: {task.user_name}</span>
        </div>
        <p>Payout: {formatCurrency(parseFloat(task.payout_value))}</p>
        {task.comment && <p>Comment: {task.comment}</p>}
        {task.attachment && <p>Attachment: {task.attachment}</p>}
        {task.payment_status === 'Unpaid' && (
          <div className="mt-4 space-x-2">
            <Button
              onClick={() => handleAction('Approve')}
              className="bg-green-500 hover:bg-green-600 text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Approve'}
            </Button>
            <Button
              onClick={() => handleAction('Reject')}
              className="bg-red-500 hover:bg-red-600 text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Reject'}
            </Button>
          </div>
        )}
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>
              Are you sure you want to {actionType?.toLowerCase()} this task?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmAction}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
