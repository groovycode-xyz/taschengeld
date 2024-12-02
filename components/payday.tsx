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

type SortField = 'title' | 'user' | 'amount' | 'date';
type SortDirection = 'asc' | 'desc';

export function Payday() {
  const [completedTasks, setCompletedTasks] = useState<CompletedTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingTaskIds, setLoadingTaskIds] = useState<number[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('title');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

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

  const handleUpdatePaymentStatus = async (cTaskId: number, paymentStatus: 'Paid' | 'Unpaid') => {
    setLoadingTaskIds((prev) => [...prev, cTaskId]);
    try {
      if (paymentStatus === 'Paid') {
        await playCoinSound();
      } else {
        await playWooshSound();
      }

      const response = await fetch('/api/completed-tasks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ c_task_id: cTaskId, payment_status: paymentStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process task');
      }

      const updatedTask = await response.json();
      console.log('Task processed successfully:', updatedTask);

      setCompletedTasks((prevTasks) => prevTasks.filter((task) => task.c_task_id !== cTaskId));
      setSelectedTasks((prev) => prev.filter((id) => id !== cTaskId));
    } catch (error) {
      console.error('Error updating payment status:', error);
      setError(error instanceof Error ? error.message : 'Failed to process task');
    } finally {
      setLoadingTaskIds((prev) => prev.filter((id) => id !== cTaskId));
    }
  };

  const handleTaskSelect = (taskId: number) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  const handleBulkApprove = async () => {
    for (const taskId of selectedTasks) {
      await handleUpdatePaymentStatus(taskId, 'Paid');
    }
    setSelectedTasks([]);
  };

  const handleBulkReject = async () => {
    for (const taskId of selectedTasks) {
      await handleUpdatePaymentStatus(taskId, 'Unpaid');
    }
    setSelectedTasks([]);
  };

  const sortTasks = (tasks: CompletedTask[]) => {
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
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  };

  const filteredAndSortedTasks = sortTasks(
    selectedUser === 'all'
      ? completedTasks
      : completedTasks.filter((task) => task.user_name === selectedUser)
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='p-8 space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Payday</h1>
        {selectedTasks.length > 0 && (
          <div className='flex space-x-4'>
            <Button onClick={handleBulkApprove} className='bg-green-500 hover:bg-green-600'>
              Approve Selected ({selectedTasks.length})
            </Button>
            <Button onClick={handleBulkReject} className='bg-red-500 hover:bg-red-600'>
              Reject Selected ({selectedTasks.length})
            </Button>
          </div>
        )}
      </div>

      <div className='flex space-x-4'>
        <Select value={selectedUser} onValueChange={setSelectedUser}>
          <SelectTrigger className='w-[200px]'>
            <SelectValue placeholder='Filter by user' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Users</SelectItem>
            {Array.from(new Set(completedTasks.map((task) => task.user_name))).map((userName) => (
              <SelectItem key={userName} value={userName}>
                {userName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortField} onValueChange={(value) => setSortField(value as SortField)}>
          <SelectTrigger className='w-[200px]'>
            <SelectValue placeholder='Sort by' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='title'>Task Title</SelectItem>
            <SelectItem value='user'>User</SelectItem>
            <SelectItem value='amount'>Amount</SelectItem>
            <SelectItem value='date'>Date</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant='outline'
          onClick={() => setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
        >
          {sortDirection === 'asc' ? '↑' : '↓'}
        </Button>
      </div>

      <div className='space-y-4'>
        {filteredAndSortedTasks.map((task) => (
          <CompletedTaskCard
            key={task.c_task_id}
            task={task}
            onUpdateStatus={handleUpdatePaymentStatus}
            isLoading={loadingTaskIds.includes(task.c_task_id)}
            isSelected={selectedTasks.includes(task.c_task_id)}
            onSelect={handleTaskSelect}
          />
        ))}
        {filteredAndSortedTasks.length === 0 && (
          <div className='text-center text-gray-500 py-8'>No tasks to display</div>
        )}
      </div>
    </div>
  );
}
