'use client';

import React, { useState, useEffect } from 'react';
import { CompletedTask } from '@/app/types/completedTask';
import { CompletedTaskCard } from './completed-task-card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CurrencyDisplay } from '@/components/ui/currency-display';

type SortField = 'title' | 'user' | 'amount' | 'date';
type SortDirection = 'asc' | 'desc';
type GroupByField = 'user' | 'date' | 'none';
type ViewOption = 'by_user' | 'by_date' | 'no_groups';

export function Payday() {
  const [completedTasks, setCompletedTasks] = useState<CompletedTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingTaskIds, setLoadingTaskIds] = useState<number[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  const [filterUser, setFilterUser] = useState<string>('all');
  const [viewOption, setViewOption] = useState<ViewOption>('by_user');
  const [secondarySortField, setSecondarySortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [bulkActionType, setBulkActionType] = useState<'Paid' | 'Unpaid' | null>(null);
  const [isBulkConfirmOpen, setIsBulkConfirmOpen] = useState(false);

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
      console.error('Error fetching completed tasks:', err);
      setError('Failed to load completed tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const playCoinSound = async () => {
    try {
      let audio = new Audio('/sounds/coin-ching.mp3');
      await audio.play().catch(() => {
        audio = new Audio('/sounds/coin-ching.wav');
        return audio.play();
      });
    } catch (error) {
      console.error('Error playing coin sound:', error);
    }
  };

  const playWooshSound = async () => {
    try {
      let audio = new Audio('/sounds/woosh1.mp3');
      await audio.play().catch(() => {
        audio = new Audio('/sounds/woosh1.wav');
        return audio.play();
      });
    } catch (error) {
      console.error('Error playing woosh sound:', error);
    }
  };

  const handleUpdatePaymentStatus = async (cTaskId: number, paymentStatus: 'Paid' | 'Unpaid', isRejection: boolean = false) => {
    setLoadingTaskIds((prev) => [...prev, cTaskId]);
    try {
      if (!isRejection && paymentStatus === 'Paid') {
        await playCoinSound();
      } else {
        await playWooshSound();
      }

      const response = await fetch('/api/completed-tasks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          c_task_id: cTaskId, 
          payment_status: paymentStatus,
          is_rejected: isRejection 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process task');
      }

      setCompletedTasks((prevTasks) => prevTasks.filter((task) => task.c_task_id !== cTaskId));
      setSelectedTasks((prev) => prev.filter((id) => id !== cTaskId));

      await fetchCompletedTasks();
    } catch (error) {
      console.error('Error updating payment status:', error);
      setError(error instanceof Error ? error.message : 'Failed to process task');
      await fetchCompletedTasks();
    } finally {
      setLoadingTaskIds((prev) => prev.filter((id) => id !== cTaskId));
    }
  };

  const handleTaskSelect = (taskId: number) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  const handleSelectAll = (groupTasks: CompletedTask[]) => {
    const groupTaskIds = groupTasks.map((task) => task.c_task_id);
    setSelectedTasks((prev) => {
      if (groupTaskIds.every((id) => prev.includes(id))) {
        return prev.filter((id) => !groupTaskIds.includes(id));
      }
      return [...new Set([...prev, ...groupTaskIds])];
    });
  };

  const handleBulkActionClick = (action: 'Paid' | 'Unpaid') => {
    setBulkActionType(action);
    setIsBulkConfirmOpen(true);
  };

  const confirmBulkAction = async () => {
    if (bulkActionType) {
      try {
        const tasksToProcess = [...selectedTasks];
        for (const taskId of tasksToProcess) {
          await handleUpdatePaymentStatus(
            taskId,
            'Paid',
            bulkActionType === 'Unpaid'
          );
        }
      } catch (error) {
        console.error('Error in bulk action:', error);
        setError(error instanceof Error ? error.message : 'Failed to process bulk action');
      } finally {
        setSelectedTasks([]);
        setIsBulkConfirmOpen(false);
        setBulkActionType(null);
        await fetchCompletedTasks();
      }
    }
  };

  // Calculate total amount for selected tasks
  const selectedTasksTotal = selectedTasks
    .map(taskId => completedTasks.find(task => task.c_task_id === taskId)?.payout_value || '0')
    .reduce((sum, value) => sum + parseFloat(value), 0);

  const sortTasks = (tasks: CompletedTask[], sortField: SortField) => {
    return [...tasks].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'title':
          comparison = a.task_title.localeCompare(b.task_title);
          break;
        case 'user':
          comparison = a.user_name.localeCompare(b.user_name);
          break;
        case 'amount':
          comparison = parseFloat(a.payout_value) - parseFloat(b.payout_value);
          break;
        case 'date':
          comparison = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  };

  const organizeTasksByView = (tasks: CompletedTask[]) => {
    // First filter by user if needed
    const filteredTasks = filterUser === 'all' 
      ? tasks 
      : tasks.filter(task => task.user_name === filterUser);

    // Then organize based on view option
    switch (viewOption) {
      case 'by_user':
        return filteredTasks.reduce((groups: { [key: string]: CompletedTask[] }, task) => {
          const groupKey = task.user_name;
          if (!groups[groupKey]) {
            groups[groupKey] = [];
          }
          groups[groupKey].push(task);
          return groups;
        }, {});
      case 'by_date':
        return filteredTasks.reduce((groups: { [key: string]: CompletedTask[] }, task) => {
          const groupKey = new Date(task.created_at).toLocaleDateString();
          if (!groups[groupKey]) {
            groups[groupKey] = [];
          }
          groups[groupKey].push(task);
          return groups;
        }, {});
      case 'no_groups':
        return { 'All Tasks': filteredTasks };
    }
  };

  // Organize and sort tasks
  const organizedTasks = organizeTasksByView(completedTasks);
  // Sort tasks within each group
  Object.keys(organizedTasks).forEach(groupKey => {
    organizedTasks[groupKey] = sortTasks(organizedTasks[groupKey], secondarySortField);
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='p-8 bg-[#FBFBFB] rounded-2xl space-y-8 max-w-7xl mx-auto'>
      <div className='flex justify-between items-center pb-6 border-b border-gray-200'>
        <h1 className='text-2xl font-bold'>Payday</h1>
        {selectedTasks.length > 0 && (
          <div className='flex items-center gap-4'>
            <span className='text-sm font-medium text-gray-500'>
              {selectedTasks.length} item{selectedTasks.length !== 1 ? 's' : ''} selected
            </span>
            <Button
              onClick={() => handleBulkActionClick('Paid')}
              className='bg-green-500 hover:bg-green-600 text-white'
            >
              Approve Selected ({selectedTasks.length})
            </Button>
            <Button
              onClick={() => handleBulkActionClick('Unpaid')}
              className='bg-red-500 hover:bg-red-600 text-white'
            >
              Reject Selected ({selectedTasks.length})
            </Button>
          </div>
        )}
      </div>

      <div className='flex flex-wrap gap-4 items-center'>
        <Select value={viewOption} onValueChange={(value) => setViewOption(value as ViewOption)}>
          <SelectTrigger className='w-[200px]'>
            <SelectValue placeholder='View tasks' />
          </SelectTrigger>
          <SelectContent className='bg-white'>
            <SelectItem value='by_user'>Group by User</SelectItem>
            <SelectItem value='by_date'>Group by Date</SelectItem>
            <SelectItem value='no_groups'>No Grouping</SelectItem>
          </SelectContent>
        </Select>

        {filterUser !== 'all' && viewOption === 'by_user' && (
          <div className='text-sm text-gray-500'>
            Note: User filter is ignored when grouping by user
          </div>
        )}

        {viewOption !== 'by_user' && (
          <Select value={filterUser} onValueChange={setFilterUser}>
            <SelectTrigger className='w-[200px]'>
              <SelectValue placeholder='Filter by user' />
            </SelectTrigger>
            <SelectContent className='bg-white'>
              <SelectItem value='all'>All Users</SelectItem>
              {Array.from(new Set(completedTasks.map((task) => task.user_name))).map((userName) => (
                <SelectItem key={userName} value={userName}>
                  {userName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <div className='flex items-center gap-2'>
          <Select value={secondarySortField} onValueChange={(value) => setSecondarySortField(value as SortField)}>
            <SelectTrigger className='w-[200px]'>
              <SelectValue placeholder='Sort within groups' />
            </SelectTrigger>
            <SelectContent className='bg-white'>
              <SelectItem value='date'>By Date</SelectItem>
              <SelectItem value='title'>By Task Name</SelectItem>
              <SelectItem value='amount'>By Amount</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant='outline'
            onClick={() => setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
            className='px-3'
          >
            {sortDirection === 'asc' ? '↑' : '↓'}
          </Button>
        </div>
      </div>

      <div className='space-y-8'>
        {Object.entries(organizedTasks).map(([groupName, tasks]) => (
          <div key={groupName} className='space-y-4'>
            <div className='flex justify-between items-center border-b pb-2'>
              <div className='flex items-center gap-4'>
                <h2 className='text-xl font-semibold'>{groupName}</h2>
                {tasks.length > 0 && (
                  <Checkbox
                    checked={tasks.every((task) => selectedTasks.includes(task.c_task_id))}
                    onCheckedChange={() => handleSelectAll(tasks)}
                    className='ml-2'
                  />
                )}
              </div>
              {tasks.filter((task) => selectedTasks.includes(task.c_task_id)).length > 0 && (
                <span className='text-sm text-gray-500'>
                  {tasks.filter((task) => selectedTasks.includes(task.c_task_id)).length} of{' '}
                  {tasks.length} selected
                </span>
              )}
            </div>
            <div className='space-y-4'>
              {tasks.map((task) => (
                <CompletedTaskCard
                  key={task.c_task_id}
                  task={task}
                  onUpdateStatus={handleUpdatePaymentStatus}
                  isLoading={loadingTaskIds.includes(task.c_task_id)}
                  isSelected={selectedTasks.includes(task.c_task_id)}
                  onSelect={handleTaskSelect}
                />
              ))}
            </div>
          </div>
        ))}
        {Object.keys(organizedTasks).length === 0 && (
          <div className='text-center text-gray-500 py-8'>No tasks to display</div>
        )}
      </div>

      <Dialog open={isBulkConfirmOpen} onOpenChange={setIsBulkConfirmOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>
              {bulkActionType === 'Paid' ? 'Approve' : 'Reject'} Multiple Tasks
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to {bulkActionType === 'Paid' ? 'approve' : 'reject'}{' '}
              {selectedTasks.length} task{selectedTasks.length !== 1 ? 's' : ''} with a total value of{' '}
              <CurrencyDisplay value={selectedTasksTotal} />?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => {
                setIsBulkConfirmOpen(false);
                setBulkActionType(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmBulkAction}
              className={
                bulkActionType === 'Paid'
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }
            >
              {bulkActionType === 'Paid' ? 'Approve' : 'Reject'} Selected
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
