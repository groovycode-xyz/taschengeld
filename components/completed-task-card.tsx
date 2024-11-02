import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CompletedTask } from '@/app/types/completedTask';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { IconComponent } from './icon-component';
import { Checkbox } from '@/components/ui/checkbox';

interface CompletedTaskCardProps {
  task: CompletedTask;
  onUpdateStatus: (cTaskId: number, newStatus: string) => void;
  isLoading: boolean;
  isSelected?: boolean;
  onSelect?: (taskId: number, checked: boolean) => void;
  newestTaskId?: number | null;
}

export function CompletedTaskCard({
  task,
  onUpdateStatus,
  isLoading,
  isSelected,
  onSelect,
  newestTaskId,
}: CompletedTaskCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'Approve' | 'Reject' | null>(null);

  const handleAction = (action: 'Approve' | 'Reject') => {
    setActionType(action);
    setIsDialogOpen(true);
  };

  const confirmAction = () => {
    if (actionType) {
      const newStatus = actionType === 'Reject' ? 'Rejected' : 'Approved';
      onUpdateStatus(task.c_task_id, newStatus);
    }
    setIsDialogOpen(false);
  };

  return (
    <Card
      className={`rounded-lg shadow-md hover:shadow-lg transition-shadow bg-white ${
        task.c_task_id === newestTaskId ? 'animate-new-task' : ''
      }`}
    >
      <CardContent className="p-4 flex items-center space-x-4">
        {/* Checkbox */}
        {onSelect && (
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onSelect(task.c_task_id, checked as boolean)}
            disabled={isLoading}
          />
        )}

        {/* Task Icon and Title */}
        <div className="flex items-center space-x-3 min-w-[200px]">
          <IconComponent icon={task.icon_name} className="h-8 w-8 text-blue-500" />
          <span className="font-semibold">{task.task_title}</span>
        </div>

        {/* Completed By */}
        <div className="flex items-center space-x-2 flex-1">
          <IconComponent icon={task.user_icon} className="h-6 w-6 text-gray-500" />
          <span className="text-gray-600">Completed by: {task.user_name}</span>
        </div>

        {/* Payout Amount */}
        <div className="font-bold text-lg min-w-[100px]">
          <CurrencyDisplay value={parseFloat(task.payout_value)} />
        </div>

        {/* Action Buttons */}
        {task.payment_status === 'Unpaid' && (
          <div className="flex space-x-2">
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
            <DialogTitle>
              {actionType === 'Approve' ? 'Approve Payment' : 'Reject Payment'}
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to {actionType?.toLowerCase()} this payment of{' '}
              <CurrencyDisplay value={parseFloat(task.payout_value)} /> for {task.task_title}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmAction}
              className={
                actionType === 'Approve'
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }
            >
              {actionType}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
