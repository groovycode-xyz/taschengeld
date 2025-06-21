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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Banknote, Filter, SortAsc } from 'lucide-react';
import { useLanguage } from '@/components/context/language-context';

export function Payday() {
  const { getTermFor } = useLanguage();
  const [completedTasks, setCompletedTasks] = useState<CompletedTask[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [bulkActionType, setBulkActionType] = useState<'approve' | 'reject'>('approve');
  const [filterUser, setFilterUser] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'age'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

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

  // Get unique users for filter dropdown
  const uniqueUsers = Array.from(
    new Set(completedTasks.map((task) => task.user_name).filter(Boolean))
  ).sort();

  // Filter tasks
  const filteredTasks =
    filterUser === 'all'
      ? completedTasks
      : completedTasks.filter((task) => task.user_name === filterUser);

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'name') {
      const nameA = a.user_name || '';
      const nameB = b.user_name || '';
      return sortOrder === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    } else {
      // Sort by age (using birthday)
      const ageA = a.user_birthday ? new Date(a.user_birthday).getTime() : 0;
      const ageB = b.user_birthday ? new Date(b.user_birthday).getTime() : 0;
      // For age, newer birthdays (younger) should come first when ascending
      return sortOrder === 'asc' ? ageB - ageA : ageA - ageB;
    }
  });

  // Group tasks by user
  const organizedTasks = sortedTasks.reduce((groups: { [key: string]: CompletedTask[] }, task) => {
    const groupKey = task.user_name || 'Unknown User';
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(task);
    return groups;
  }, {});

  // Handle select all for a group
  const handleGroupSelectAll = (groupName: string, tasks: CompletedTask[]) => {
    const groupTaskIds = tasks.map((task) => task.c_task_id);
    const allSelected = groupTaskIds.every((id) => selectedTasks.includes(id));

    if (allSelected) {
      // Deselect all tasks in this group
      setSelectedTasks(selectedTasks.filter((id) => !groupTaskIds.includes(id)));
    } else {
      // Select all tasks in this group
      const newSelectedTasks = Array.from(new Set([...selectedTasks, ...groupTaskIds]));
      setSelectedTasks(newSelectedTasks);
    }
  };

  // Check if all tasks in a group are selected
  const isGroupSelected = (tasks: CompletedTask[]) => {
    if (tasks.length === 0) return false;
    return tasks.every((task) => selectedTasks.includes(task.c_task_id));
  };

  // Check if some tasks in a group are selected
  const isGroupPartiallySelected = (tasks: CompletedTask[]) => {
    const selectedCount = tasks.filter((task) => selectedTasks.includes(task.c_task_id)).length;
    return selectedCount > 0 && selectedCount < tasks.length;
  };

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

        {/* Filter and Sort Controls */}
        <div className='flex items-center gap-4 pt-6'>
          <div className='flex items-center gap-2'>
            <Filter className='h-4 w-4 text-muted-foreground' />
            <Select value={filterUser} onValueChange={setFilterUser}>
              <SelectTrigger className='w-[200px]'>
                <SelectValue placeholder='Filter by user' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>{getTermFor('Alle', 'All')}</SelectItem>
                {uniqueUsers.map((userName) => (
                  <SelectItem key={userName} value={userName}>
                    {userName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='flex items-center gap-2'>
            <SortAsc className='h-4 w-4 text-muted-foreground' />
            <Select value={sortBy} onValueChange={(value: 'name' | 'age') => setSortBy(value)}>
              <SelectTrigger className='w-[200px]'>
                <SelectValue placeholder='Sort by' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='name'>{getTermFor('Name', 'Name')}</SelectItem>
                <SelectItem value='age'>{getTermFor('Alter', 'Age')}</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={sortOrder}
              onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}
            >
              <SelectTrigger className='w-[120px]'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='asc'>
                  {sortBy === 'age'
                    ? getTermFor('Jüngste zuerst', 'Youngest first')
                    : getTermFor('A-Z', 'A-Z')}
                </SelectItem>
                <SelectItem value='desc'>
                  {sortBy === 'age'
                    ? getTermFor('Älteste zuerst', 'Oldest first')
                    : getTermFor('Z-A', 'Z-A')}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className='flex-1 overflow-y-auto p-8 pt-4 bg-secondary'>
        {/* Task Groups */}
        <div className='space-y-8'>
          {Object.entries(organizedTasks).map(([groupName, tasks]) => (
            <div key={groupName} className='space-y-4'>
              <div className='flex items-center gap-3'>
                <Checkbox
                  checked={isGroupSelected(tasks)}
                  onCheckedChange={() => handleGroupSelectAll(groupName, tasks)}
                  className='mt-1'
                  data-state={isGroupPartiallySelected(tasks) ? 'indeterminate' : undefined}
                />
                <h2 className='text-2xl font-semibold'>{groupName}</h2>
                <span className='text-sm text-muted-foreground'>
                  ({tasks.length} {tasks.length === 1 ? 'task' : 'tasks'})
                </span>
              </div>
              <div className='space-y-4 ml-7'>
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
