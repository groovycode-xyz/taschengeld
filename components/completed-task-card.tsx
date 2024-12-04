import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { cn } from '@/lib/utils';
import { CompletedTask } from '@/app/types/completedTask';

interface CompletedTaskCardProps {
  task: CompletedTask;
  onUpdateStatus: (taskId: number, status: 'Paid' | 'Unpaid', isRejection?: boolean) => void;
  onSelect?: (taskId: number) => void;
  isLoading?: boolean;
  isSelected?: boolean;
  newestTaskId?: number;
}

export function CompletedTaskCard({
  task,
  onUpdateStatus,
  onSelect,
  isLoading = false,
  isSelected = false,
  newestTaskId,
}: CompletedTaskCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'Approve' | 'Reject' | null>(null);

  const handleAction = (action: 'Approve' | 'Reject') => {
    setActionType(action);
    setIsDialogOpen(true);
  };

  const confirmAction = async () => {
    if (actionType) {
      setIsDialogOpen(false);
      const paymentStatus = 'Paid';
      const isRejection = actionType === 'Reject';
      onUpdateStatus(task.c_task_id, paymentStatus, isRejection);
    }
  };

  return (
    <Card
      className={cn(
        'w-full hover:shadow-lg transition-shadow duration-300 bg-white shadow-md',
        newestTaskId === task.c_task_id && 'animate-highlight'
      )}
    >
      <CardContent className='flex items-center justify-between p-6'>
        {/* Checkbox for multi-select */}
        <div className='flex-none mr-4'>
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onSelect?.(task.c_task_id)}
            className='mt-1'
          />
        </div>

        <div className='flex items-center space-x-4 flex-1'>
          <IconComponent icon={task.icon_name} className='h-8 w-8 text-gray-600' />
          <div>
            <h3 className='font-medium'>{task.task_title}</h3>
            {task.comment && <p className='text-sm text-gray-500'>{task.comment}</p>}
          </div>
        </div>

        {/* Completed By */}
        <div className='flex items-center space-x-2 flex-1'>
          <IconComponent icon={task.user_icon} className='h-6 w-6 text-gray-500' />
          <span className='text-gray-600'>Completed by: {task.user_name}</span>
        </div>

        {/* Completion Date */}
        <div className='flex items-center space-x-2 flex-1'>
          <span className='text-gray-500 text-sm'>
            Completed: {new Date(task.created_at).toLocaleDateString()}
          </span>
        </div>

        {/* Payout Amount */}
        <div className='font-bold text-lg min-w-[100px]'>
          <CurrencyDisplay value={parseFloat(task.payout_value)} />
        </div>

        {/* Action Buttons */}
        {task.payment_status === 'Unpaid' && (
          <div className='flex space-x-2'>
            <Button
              onClick={() => handleAction('Approve')}
              className='bg-green-500 hover:bg-green-600 text-white'
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Approve'}
            </Button>
            <Button
              onClick={() => handleAction('Reject')}
              className='bg-red-500 hover:bg-red-600 text-white'
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Reject'}
            </Button>
          </div>
        )}
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white">
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
            <Button variant='outline' onClick={() => setIsDialogOpen(false)}>
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
