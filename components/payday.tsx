'use client';

import React, { useState, useEffect } from 'react';
import { CompletedTask } from '@/app/types/completedTask';
import { CompletedTaskCard } from './completed-task-card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Banknote } from 'lucide-react';
import { useLanguage } from '@/components/context/language-context';

export function Payday() {
  const { getTermFor } = useLanguage();
  const [completedTasks, setCompletedTasks] = useState<CompletedTask[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [bulkActionType, setBulkActionType] = useState<'approve' | 'reject'>('approve');

  useEffect(() => {
    fetchCompletedTasks();
  }, []);

  const fetchCompletedTasks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/completed-tasks');
      if (!response.ok) {
        throw new Error('Failed to fetch completed tasks');
      }
      const data = await response.json();
      const unpaidTasks = data.filter((task: CompletedTask) => task.payment_status === 'Unpaid');
      setCompletedTasks(unpaidTasks);
    } catch (err) {
      setError('Failed to load completed tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePaymentStatus = async (
    cTaskId: number,
    paymentStatus: 'Paid' | 'Unpaid',
    isRejection: boolean = false
  ) => {
    try {
      if (isRejection) {
        // For rejections, use DELETE endpoint
        const response = await fetch(`/api/completed-tasks/${cTaskId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to reject task');
        }
      } else {
        // For approvals, use PUT endpoint
        const response = await fetch(`/api/completed-tasks/${cTaskId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            payment_status: paymentStatus,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update task');
        }
      }

      setCompletedTasks((prevTasks) => prevTasks.filter((task) => task.c_task_id !== cTaskId));
      setSelectedTasks((prev) => prev.filter((id) => id !== cTaskId));

      await fetchCompletedTasks();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to process task');
      await fetchCompletedTasks();
    }
  };

  const handleTaskSelect = (taskId: number) => {
    if (selectedTasks.includes(taskId)) {
      setSelectedTasks(selectedTasks.filter((id) => id !== taskId));
    } else {
      setSelectedTasks([...selectedTasks, taskId]);
    }
  };

  const handleBulkActionClick = (actionType: 'approve' | 'reject') => {
    setBulkActionType(actionType);
    setIsDialogOpen(true);
  };

  const confirmBulkAction = async () => {
    try {
      const tasksToProcess = [...selectedTasks];
      for (const taskId of tasksToProcess) {
        if (bulkActionType === 'approve') {
          await handleUpdatePaymentStatus(taskId, 'Paid', false);
        } else {
          await handleUpdatePaymentStatus(taskId, 'Unpaid', true);
        }
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to process bulk action');
    } finally {
      setSelectedTasks([]);
      setIsDialogOpen(false);
      await fetchCompletedTasks();
    }
  };

  const organizedTasks = completedTasks.reduce(
    (groups: { [key: string]: CompletedTask[] }, task) => {
      const groupKey = 'All Tasks';
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(task);
      return groups;
    },
    {}
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='h-[calc(100vh-4rem)] flex flex-col bg-background'>
      {/* Fixed Header */}
      <div className='p-8 bg-secondary'>
        <div className='flex items-center justify-between pb-6 border-b border-border'>
          <div className='flex items-center space-x-4'>
            <Banknote className='h-8 w-8 text-foreground' />
            <h1 className='text-3xl font-medium text-foreground'>
              {getTermFor('Zahltag', 'Payday')}
            </h1>
          </div>
          {selectedTasks.length > 0 && (
            <div className='flex items-center gap-4'>
              <span className='text-sm font-medium text-muted-foreground'>
                {selectedTasks.length} item{selectedTasks.length !== 1 ? 's' : ''} selected
              </span>
              <div className='flex gap-2'>
                <Button
                  onClick={() => handleBulkActionClick('approve')}
                  className='bg-green-500 hover:bg-green-600 text-white'
                >
                  Approve Selected ({selectedTasks.length})
                </Button>
                <Button
                  onClick={() => handleBulkActionClick('reject')}
                  className='bg-red-500 hover:bg-red-600 text-white'
                >
                  Reject Selected ({selectedTasks.length})
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className='flex-1 overflow-y-auto p-8 pt-4 bg-secondary'>
        {/* Task Groups */}
        <div className='space-y-8'>
          {Object.entries(organizedTasks).map(([groupName, tasks]) => (
            <div key={groupName} className='space-y-4'>
              <h2 className='text-2xl font-semibold'>{groupName}</h2>
              <div className='space-y-4'>
                {tasks.map((task) => (
                  <CompletedTaskCard
                    key={task.c_task_id}
                    task={task}
                    onUpdateStatus={handleUpdatePaymentStatus}
                    onSelect={handleTaskSelect}
                    isSelected={selectedTasks.includes(task.c_task_id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bulk Action Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Confirm Bulk {bulkActionType === 'approve' ? 'Approval' : 'Rejection'}
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to {bulkActionType} {selectedTasks.length} task
              {selectedTasks.length !== 1 ? 's' : ''}?
              {bulkActionType === 'reject' && ' This will permanently delete the completed tasks.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='flex justify-end space-x-2'>
            <Button variant='outline' onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmBulkAction}
              variant={bulkActionType === 'approve' ? 'default' : 'destructive'}
            >
              {bulkActionType === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
