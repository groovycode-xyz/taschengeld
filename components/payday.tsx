'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { CompletedTask } from '@/app/types/completedTask';
import { CompletedTaskCard } from './completed-task-card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SortAsc, SortDesc, Banknote } from 'lucide-react';
import { IconComponent } from '@/components/icon-component';

type SortField = 'date' | 'payout' | 'title';
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
      // Try mp3 first
      let audio = new Audio('/sounds/coin-ching.mp3');
      await audio.play().catch(() => {
        // If mp3 fails, try wav
        audio = new Audio('/sounds/coin-ching.wav');
        return audio.play();
      });
    } catch (error) {
      console.error('Error playing coin sound:', error);
    }
  };

  const playWooshSound = async () => {
    try {
      // Try mp3 first
      let audio = new Audio('/sounds/woosh1.mp3');
      await audio.play().catch(() => {
        // If mp3 fails, try wav
        audio = new Audio('/sounds/woosh1.wav');
        return audio.play();
      });
    } catch (error) {
      console.error('Error playing woosh sound:', error);
    }
  };

  const handleUpdatePaymentStatus = async (cTaskId: number, newStatus: string) => {
    setLoadingTaskIds((prev) => [...prev, cTaskId]);
    try {
      console.log('Payment status update:', newStatus);
      if (newStatus === 'Approved') {
        await playCoinSound();
      } else if (newStatus === 'Rejected') {
        console.log('Playing woosh sound');
        await playWooshSound();
      }

      const response = await fetch('/api/completed-tasks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ c_task_id: cTaskId, payment_status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process task');
      }

      const updatedTask = await response.json();
      console.log('Task processed successfully:', updatedTask);

      setCompletedTasks((prevTasks) => prevTasks.filter((task) => task.c_task_id !== cTaskId));
    } catch (error) {
      console.error('Error updating payment status:', error);
      setError(error instanceof Error ? error.message : 'Failed to process task');
    } finally {
      setLoadingTaskIds((prev) => prev.filter((id) => id !== cTaskId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedTasks(checked ? completedTasks.map((task) => task.c_task_id) : []);
  };

  const handleSelectTask = (taskId: number, checked: boolean) => {
    setSelectedTasks((prev) => (checked ? [...prev, taskId] : prev.filter((id) => id !== taskId)));
  };

  const handleBulkAction = async (newStatus: 'Approved' | 'Rejected') => {
    // Process tasks sequentially to maintain sound effects
    for (const taskId of selectedTasks) {
      await handleUpdatePaymentStatus(taskId, newStatus);
    }
    setSelectedTasks([]); // Clear selection after processing
  };

  // Get unique users from completed tasks
  const users = useMemo(() => {
    const uniqueUsers = Array.from(new Set(completedTasks.map((task) => task.user_name))).sort();
    return uniqueUsers;
  }, [completedTasks]);

  // Group and sort tasks
  const groupedAndSortedTasks = useMemo(() => {
    let filtered = [...completedTasks];

    // Apply user filter
    if (selectedUser !== 'all') {
      filtered = filtered.filter((task) => task.user_name === selectedUser);
    }

    // Sort tasks within each group
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'date':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case 'payout':
          comparison = parseFloat(a.payout_value) - parseFloat(b.payout_value);
          break;
        case 'title':
          comparison = a.task_title.localeCompare(b.task_title);
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    // Group by user
    const grouped = filtered.reduce((acc, task) => {
      const userName = task.user_name;
      if (!acc[userName]) {
        acc[userName] = [];
      }
      acc[userName].push(task);
      return acc;
    }, {} as Record<string, CompletedTask[]>);

    // Convert to array of entries and sort by user age (assuming younger users have higher user_id)
    const sortedEntries = Object.entries(grouped).sort(([, tasksA], [, tasksB]) => {
      // Compare user_id of first task in each group
      // Assuming higher user_id means younger user
      return tasksB[0].user_id - tasksA[0].user_id;
    });

    // Convert back to object
    return Object.fromEntries(sortedEntries);
  }, [completedTasks, selectedUser, sortField, sortDirection]);

  // Toggle sort direction
  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-8 bg-[#FBFBFB] rounded-2xl space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center pb-6 border-b border-gray-200">
        <h1 className="text-3xl font-bold flex items-center">
          <Banknote className="mr-3 h-10 w-10" />
          Payday
        </h1>
        {completedTasks.length > 0 && (
          <div className="flex items-center space-x-4">
            <Checkbox
              checked={selectedTasks.length === completedTasks.length}
              onCheckedChange={handleSelectAll}
              id="select-all"
            />
            <label htmlFor="select-all" className="text-sm">
              Select All
            </label>
          </div>
        )}
      </div>

      {completedTasks.length > 0 && (
        <div className="flex flex-col md:flex-row gap-4">
          {/* User Filter */}
          <Select value={selectedUser} onValueChange={setSelectedUser}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by user" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              {users.map((user) => (
                <SelectItem key={user} value={user}>
                  {user}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort Controls */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleSort('date')}
              className={sortField === 'date' ? 'border-primary' : ''}
            >
              Date{' '}
              {sortField === 'date' &&
                (sortDirection === 'asc' ? (
                  <SortAsc className="ml-2 h-4 w-4" />
                ) : (
                  <SortDesc className="ml-2 h-4 w-4" />
                ))}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleSort('payout')}
              className={sortField === 'payout' ? 'border-primary' : ''}
            >
              Payout{' '}
              {sortField === 'payout' &&
                (sortDirection === 'asc' ? (
                  <SortAsc className="ml-2 h-4 w-4" />
                ) : (
                  <SortDesc className="ml-2 h-4 w-4" />
                ))}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleSort('title')}
              className={sortField === 'title' ? 'border-primary' : ''}
            >
              Title{' '}
              {sortField === 'title' &&
                (sortDirection === 'asc' ? (
                  <SortAsc className="ml-2 h-4 w-4" />
                ) : (
                  <SortDesc className="ml-2 h-4 w-4" />
                ))}
            </Button>
          </div>
        </div>
      )}

      {/* Bulk Actions Bar */}
      {selectedTasks.length > 0 && (
        <div className="fixed bottom-4 right-4 left-4 md:left-auto bg-white p-4 rounded-lg shadow-lg border flex items-center justify-between gap-4">
          <span className="text-sm font-medium">
            {selectedTasks.length} task{selectedTasks.length === 1 ? '' : 's'} selected
          </span>
          <div className="flex gap-2">
            <Button
              onClick={() => handleBulkAction('Approved')}
              className="bg-green-500 hover:bg-green-600 text-white"
              disabled={isLoading}
            >
              Approve Selected
            </Button>
            <Button
              onClick={() => handleBulkAction('Rejected')}
              variant="destructive"
              disabled={isLoading}
            >
              Reject Selected
            </Button>
          </div>
        </div>
      )}

      {Object.keys(groupedAndSortedTasks).length === 0 ? (
        <p>No unpaid tasks available.</p>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedAndSortedTasks).map(([userName, tasks]) => (
            <div key={userName} className="space-y-4">
              <h2 className="text-xl font-semibold text-green-700 border-b border-green-200 pb-2 flex items-center gap-2">
                <IconComponent icon={tasks[0].user_icon} className="h-6 w-6 text-green-700" />
                {userName}
              </h2>
              <div className="space-y-4">
                {tasks.map((task) => (
                  <CompletedTaskCard
                    key={task.c_task_id}
                    task={task}
                    onUpdateStatus={handleUpdatePaymentStatus}
                    isLoading={loadingTaskIds.includes(task.c_task_id)}
                    isSelected={selectedTasks.includes(task.c_task_id)}
                    onSelect={handleSelectTask}
                    newestTaskId={null}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
