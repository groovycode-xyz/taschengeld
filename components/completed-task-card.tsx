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
import { ThumbsUp, Trash2 } from 'lucide-react';

interface CompletedTaskCardProps {
  task: CompletedTask;
  onUpdateStatus: (taskId: number, status: 'Paid' | 'Unpaid', isRejection?: boolean) => void;
  onSelect?: (taskId: number) => void;
  isSelected?: boolean;
  newestTaskId?: number;
}

export function CompletedTaskCard({
  task,
  onUpdateStatus,
  onSelect,
  isSelected = false,
  newestTaskId,
}: CompletedTaskCardProps) {
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

  const handleApproveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsApproveDialogOpen(true);
  };

  const handleRejectClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRejectDialogOpen(true);
  };

  const confirmApprove = async () => {
    setIsApproveDialogOpen(false);
    try {
      await onUpdateStatus(task.c_task_id, 'Paid', false);
    } catch (err) {
      console.error('Error approving task:', err);
    }
  };

  const confirmReject = async () => {
    setIsRejectDialogOpen(false);
    try {
      await onUpdateStatus(task.c_task_id, 'Unpaid', true);
    } catch (err) {
      console.error('Error rejecting task:', err);
    }
  };

  return (
    <>
      <Card
        className={cn(
          'relative transition-all duration-200',
          'hover:shadow-md cursor-pointer',
          isSelected && 'ring-2 ring-[hsl(var(--task-active))]',
          task.payment_status === 'Paid'
            ? 'bg-[hsl(var(--task-inactive))] text-[hsl(var(--task-inactive-foreground))]'
            : 'bg-[hsl(var(--task-active))] text-[hsl(var(--task-active-foreground))]',
          newestTaskId === task.c_task_id && 'animate-highlight'
        )}
        onClick={() => onSelect?.(task.c_task_id)}
      >
        <CardContent className='p-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <div className='flex-shrink-0'>
                <IconComponent
                  icon={task.icon_name}
                  className={cn(
                    'w-8 h-8',
                    task.payment_status === 'Paid'
                      ? 'text-[hsl(var(--task-inactive-foreground))]'
                      : 'text-[hsl(var(--task-active-foreground))]'
                  )}
                />
              </div>
              <div>
                <h3 className='font-medium text-foreground'>{task.task_title}</h3>
                {task.comment && <p className='text-sm text-muted-foreground'>{task.comment}</p>}
              </div>
            </div>
            <div className='flex items-center space-x-4'>
              <div className='text-right'>
                <CurrencyDisplay
                  value={task.payout_value ? parseFloat(task.payout_value.toString()) : 0}
                  className={cn(
                    'font-semibold',
                    task.payment_status === 'Paid'
                      ? 'text-[hsl(var(--task-inactive-foreground))]'
                      : 'text-[hsl(var(--task-active-foreground))]'
                  )}
                />
              </div>
              {task.payment_status === 'Unpaid' && (
                <>
                  <Button
                    size='sm'
                    variant='ghost'
                    className='text-green-600 hover:text-green-700 hover:bg-green-100'
                    onClick={handleApproveClick}
                    title='Approve'
                  >
                    <ThumbsUp className='h-4 w-4' />
                  </Button>
                  <Button
                    size='sm'
                    variant='ghost'
                    className='text-red-600 hover:text-red-700 hover:bg-red-100'
                    onClick={handleRejectClick}
                    title='Reject'
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </>
              )}
              {onSelect && (
                <Checkbox
                  checked={isSelected}
                  className='data-[state=checked]:bg-[hsl(var(--task-active))] data-[state=checked]:text-[hsl(var(--task-active-foreground))]'
                  onClick={(e) => e.stopPropagation()}
                  onCheckedChange={() => onSelect(task.c_task_id)}
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Approve Dialog */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent className='bg-white'>
          <DialogHeader>
            <DialogTitle>Approve Payment</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this payment of{' '}
              <CurrencyDisplay
                value={task.payout_value ? parseFloat(task.payout_value.toString()) : 0}
              />{' '}
              for {task.task_title}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setIsApproveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmApprove} className='bg-green-500 hover:bg-green-600 text-white'>
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className='bg-white'>
          <DialogHeader>
            <DialogTitle>Reject Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject this task? The task will be removed from the completed
              list.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setIsRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmReject} className='bg-red-500 hover:bg-red-600 text-white'>
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
