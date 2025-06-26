'use client';

import React, { useState, useEffect } from 'react';
import { CompletedTask } from '@/app/types/completedTask';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CurrencyDisplay } from '@/components/ui/currency-display';
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
import { IconComponent } from './icon-component';
import { TimeSince } from './time-since';
import {
  Banknote,
  Filter,
  SortAsc,
  SquareCheckBig,
  ThumbsUp,
  Trash2,
  Layers,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// LocalStorage key for persisting settings
const PAYDAY_SETTINGS_KEY = 'payday-settings';

interface PaydaySettings {
  filterUser: string;
  sortBy: 'name' | 'age';
  sortOrder: 'asc' | 'desc';
  groupBy: 'user' | 'task' | 'value';
}

const getDefaultSettings = (): PaydaySettings => ({
  filterUser: 'all',
  sortBy: 'name',
  sortOrder: 'asc',
  groupBy: 'user',
});

const loadSettings = (): PaydaySettings => {
  if (typeof window === 'undefined') return getDefaultSettings();

  try {
    const saved = localStorage.getItem(PAYDAY_SETTINGS_KEY);
    if (saved) {
      return { ...getDefaultSettings(), ...JSON.parse(saved) };
    }
  } catch (error) {
    // If there's an error reading from localStorage, use defaults
  }
  return getDefaultSettings();
};

const saveSettings = (settings: PaydaySettings) => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(PAYDAY_SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    // If there's an error saving to localStorage, fail silently
  }
};

export function Payday() {
  const [completedTasks, setCompletedTasks] = useState<CompletedTask[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [bulkActionType, setBulkActionType] = useState<'approve' | 'reject'>('approve');

  // Initialize settings from localStorage
  const [settings, setSettings] = useState<PaydaySettings>(getDefaultSettings());
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  const [confirmActionTask, setConfirmActionTask] = useState<{
    id: number;
    action: 'approve' | 'reject';
  } | null>(null);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const loaded = loadSettings();
    setSettings(loaded);
    setSettingsLoaded(true);
  }, []);

  // Save settings whenever they change
  useEffect(() => {
    if (settingsLoaded) {
      saveSettings(settings);
    }
  }, [settings, settingsLoaded]);

  useEffect(() => {
    fetchCompletedTasks();
  }, []);

  // Setting update functions
  const updateFilterUser = (value: string) => {
    setSettings((prev) => ({ ...prev, filterUser: value }));
  };

  const updateSortBy = (value: 'name' | 'age') => {
    setSettings((prev) => ({ ...prev, sortBy: value }));
  };

  const updateSortOrder = (value: 'asc' | 'desc') => {
    setSettings((prev) => ({ ...prev, sortOrder: value }));
  };

  const updateGroupBy = (value: 'user' | 'task' | 'value') => {
    setSettings((prev) => ({ ...prev, groupBy: value }));
  };

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
    setIsDialogOpen(false); // Close dialog immediately
    setIsBulkProcessing(true); // Show loading state

    try {
      const tasksToProcess = [...selectedTasks];

      if (bulkActionType === 'approve') {
        // Use the payday endpoint for bulk approval
        const response = await fetch('/api/completed-tasks', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            completedTaskIds: tasksToProcess,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to approve tasks');
        }
      } else {
        // For bulk rejection, process each task but don't update UI until all are done
        const promises = tasksToProcess.map((taskId) =>
          fetch(`/api/completed-tasks/${taskId}`, {
            method: 'DELETE',
          })
        );

        await Promise.all(promises);
      }

      // Clear selections and refresh data once after all operations
      setSelectedTasks([]);
      await fetchCompletedTasks();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to process bulk action');
      await fetchCompletedTasks();
    } finally {
      setIsBulkProcessing(false); // Hide loading state
    }
  };

  // Get unique users for filter dropdown
  const uniqueUsers = Array.from(
    new Set(completedTasks.map((task) => task.user_name).filter(Boolean))
  ).sort();

  // Filter tasks
  const filteredTasks =
    settings.filterUser === 'all'
      ? completedTasks
      : completedTasks.filter((task) => task.user_name === settings.filterUser);

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (settings.sortBy === 'name') {
      const nameA = a.user_name || '';
      const nameB = b.user_name || '';
      return settings.sortOrder === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    } else {
      // Sort by age (using birthday)
      const ageA = a.user_birthday ? new Date(a.user_birthday).getTime() : 0;
      const ageB = b.user_birthday ? new Date(b.user_birthday).getTime() : 0;
      // For age, newer birthdays (younger) should come first when ascending
      return settings.sortOrder === 'asc' ? ageB - ageA : ageA - ageB;
    }
  });

  // Group tasks based on selected criteria
  const organizedTasks = sortedTasks.reduce((groups: { [key: string]: CompletedTask[] }, task) => {
    let groupKey = '';

    if (settings.groupBy === 'user') {
      groupKey = task.user_name || 'Unknown User';
    } else if (settings.groupBy === 'task') {
      groupKey = task.task_title || 'Unknown Task';
    } else if (settings.groupBy === 'value') {
      const value = task.payout_value || 0;
      // Format to 2 decimal places for consistent grouping
      groupKey = value.toFixed(2);
    }

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
    <div className='h-[calc(100vh-4rem)] flex flex-col bg-background relative'>
      {/* Loading overlay for bulk operations */}
      {isBulkProcessing && (
        <div className='absolute inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center'>
          <div className='flex flex-col items-center gap-4'>
            <Loader2 className='h-8 w-8 animate-spin text-primary' />
            <p className='text-lg font-medium'>
              Processing {selectedTasks.length} task{selectedTasks.length !== 1 ? 's' : ''}...
            </p>
          </div>
        </div>
      )}
      {/* Fixed Header */}
      <div className='p-8 bg-secondary'>
        <div className='flex items-center justify-between pb-6 border-b border-border'>
          <div className='flex items-center space-x-4'>
            <Banknote className='h-8 w-8 text-foreground' />
            <h1 className='text-3xl font-medium text-foreground'>Payday</h1>
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
            <Select value={settings.filterUser} onValueChange={updateFilterUser}>
              <SelectTrigger className='w-[200px]'>
                <SelectValue placeholder='Filter by user' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All</SelectItem>
                {uniqueUsers.filter(Boolean).map((userName) => (
                  <SelectItem key={userName} value={userName!}>
                    {userName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='flex items-center gap-2'>
            <SortAsc className='h-4 w-4 text-muted-foreground' />
            <Select value={settings.sortBy} onValueChange={updateSortBy}>
              <SelectTrigger className='w-[200px]'>
                <SelectValue placeholder='Sort by' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='name'>Name</SelectItem>
                <SelectItem value='age'>Age</SelectItem>
              </SelectContent>
            </Select>
            <Select value={settings.sortOrder} onValueChange={updateSortOrder}>
              <SelectTrigger className='w-[120px]'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='asc'>
                  {settings.sortBy === 'age' ? 'Youngest first' : 'A-Z'}
                </SelectItem>
                <SelectItem value='desc'>
                  {settings.sortBy === 'age' ? 'Oldest first' : 'Z-A'}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='flex items-center gap-2'>
            <Layers className='h-4 w-4 text-muted-foreground' />
            <Select value={settings.groupBy} onValueChange={updateGroupBy}>
              <SelectTrigger className='w-[200px]'>
                <SelectValue placeholder='Group by' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='user'>User</SelectItem>
                <SelectItem value='task'>Task</SelectItem>
                <SelectItem value='value'>Value</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className='flex-1 overflow-y-auto p-8 pt-4 bg-secondary'>
        {/* Select All Button */}
        {filteredTasks.length > 0 && (
          <div className='mb-4 flex items-center'>
            <Checkbox
              checked={
                selectedTasks.length === filteredTasks.length &&
                filteredTasks.every((task) => selectedTasks.includes(task.c_task_id))
              }
              onCheckedChange={() => {
                const visibleTaskIds = filteredTasks.map((task) => task.c_task_id);

                if (
                  selectedTasks.length === visibleTaskIds.length &&
                  visibleTaskIds.every((id) => selectedTasks.includes(id))
                ) {
                  // All visible tasks are selected, so deselect all
                  setSelectedTasks([]);
                } else {
                  // Select all visible tasks
                  setSelectedTasks(visibleTaskIds);
                }
              }}
              className='mr-3'
            />
            <span className='text-sm font-medium text-muted-foreground'>
              Select All ({filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''})
            </span>
          </div>
        )}

        {/* Task Groups */}
        <div className='space-y-8'>
          {Object.entries(organizedTasks)
            .sort(([a], [b]) => {
              if (settings.groupBy === 'value') {
                // Sort by value numerically
                return parseFloat(b) - parseFloat(a); // Descending order
              }
              // For other groupings, sort alphabetically
              return a.localeCompare(b);
            })
            .map(([groupName, tasks]) => (
              <div key={groupName} className='space-y-4'>
                <div className='flex items-center gap-3'>
                  <Checkbox
                    checked={isGroupSelected(tasks)}
                    onCheckedChange={() => handleGroupSelectAll(groupName, tasks)}
                    className='mt-1'
                    data-state={isGroupPartiallySelected(tasks) ? 'indeterminate' : undefined}
                  />
                  {settings.groupBy === 'user' && tasks.length > 0 && tasks[0].user_icon && (
                    <IconComponent icon={tasks[0].user_icon} className='h-6 w-6 text-foreground' />
                  )}
                  {settings.groupBy === 'task' && tasks.length > 0 && tasks[0].icon_name && (
                    <IconComponent icon={tasks[0].icon_name} className='h-6 w-6 text-foreground' />
                  )}
                  {settings.groupBy === 'value' && <Banknote className='h-6 w-6 text-foreground' />}
                  <h2 className='text-2xl font-semibold'>
                    {settings.groupBy === 'value' ? (
                      <CurrencyDisplay value={parseFloat(groupName)} />
                    ) : (
                      groupName
                    )}
                  </h2>
                  <span className='text-sm text-muted-foreground'>
                    ({tasks.length} {tasks.length === 1 ? 'task' : 'tasks'})
                  </span>
                </div>
                <div className='space-y-4'>
                  {tasks.map((task) => (
                    <div key={task.c_task_id} className='flex items-center gap-3 group'>
                      <Checkbox
                        checked={selectedTasks.includes(task.c_task_id)}
                        onCheckedChange={() => handleTaskSelect(task.c_task_id)}
                        className='flex-shrink-0 ml-9 group-hover:shadow-lg transition-shadow'
                      />
                      <Card
                        className={cn(
                          'flex-1 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer',
                          'bg-card dark:bg-card',
                          selectedTasks.includes(task.c_task_id) && 'ring-2 ring-primary'
                        )}
                        onClick={() => handleTaskSelect(task.c_task_id)}
                      >
                        <CardContent className='flex items-center justify-between p-3'>
                          <SquareCheckBig className='h-6 w-6 mr-2 text-green-600 dark:text-green-400' />

                          <Card
                            className={cn(
                              'flex-1 mr-2 shadow-sm',
                              'bg-blue-100/50 dark:bg-blue-900/10'
                            )}
                          >
                            <CardContent className='flex items-center p-2'>
                              {task.icon_name ? (
                                <IconComponent
                                  icon={task.icon_name}
                                  className={cn('h-6 w-6 mr-2', 'text-blue-700 dark:text-blue-300')}
                                />
                              ) : (
                                <IconComponent
                                  icon='default-task-icon'
                                  className='h-6 w-6 mr-2 text-gray-400'
                                />
                              )}
                              <span
                                className={cn(
                                  'text-sm font-medium',
                                  'text-blue-900 dark:text-blue-100'
                                )}
                              >
                                {task.task_title}
                              </span>
                            </CardContent>
                          </Card>

                          <Card
                            className={cn(
                              'flex-1 mx-2 shadow-sm',
                              'bg-green-100/50 dark:bg-green-900/10'
                            )}
                          >
                            <CardContent className='flex items-center p-2'>
                              {task.user_icon ? (
                                <IconComponent
                                  icon={task.user_icon}
                                  className={cn(
                                    'h-6 w-6 mr-2',
                                    'text-green-700 dark:text-green-300'
                                  )}
                                />
                              ) : (
                                <IconComponent
                                  icon='default-user-icon'
                                  className='h-6 w-6 mr-2 text-gray-400'
                                />
                              )}
                              <span
                                className={cn(
                                  'text-sm font-medium',
                                  'text-green-900 dark:text-green-100'
                                )}
                              >
                                {task.user_name}
                              </span>
                            </CardContent>
                          </Card>

                          <Card className={cn('flex-1 ml-2 shadow-sm', 'bg-muted/50')}>
                            <CardContent className='p-2 text-center'>
                              <TimeSince date={task.created_at.toString()} />
                            </CardContent>
                          </Card>

                          <div className='flex items-center gap-2 ml-2'>
                            <Button
                              size='sm'
                              variant='ghost'
                              className='text-green-600 hover:text-green-700 hover:bg-green-100 px-3'
                              onClick={(e) => {
                                e.stopPropagation();
                                setConfirmActionTask({ id: task.c_task_id, action: 'approve' });
                              }}
                              title='Approve'
                            >
                              <ThumbsUp className='h-4 w-4' />
                            </Button>
                            <Button
                              size='sm'
                              variant='ghost'
                              className='text-red-600 hover:text-red-700 hover:bg-red-100 px-3'
                              onClick={(e) => {
                                e.stopPropagation();
                                setConfirmActionTask({ id: task.c_task_id, action: 'reject' });
                              }}
                              title='Reject'
                            >
                              <Trash2 className='h-4 w-4' />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
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

      {/* Individual Action Confirmation Dialog */}
      <Dialog open={!!confirmActionTask} onOpenChange={() => setConfirmActionTask(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Confirm {confirmActionTask?.action === 'approve' ? 'Approval' : 'Rejection'}
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to {confirmActionTask?.action} this task?
              {confirmActionTask?.action === 'reject' &&
                ' This will permanently delete the completed task.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='flex justify-end space-x-2'>
            <Button variant='outline' onClick={() => setConfirmActionTask(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (confirmActionTask) {
                  handleUpdatePaymentStatus(
                    confirmActionTask.id,
                    confirmActionTask.action === 'approve' ? 'Paid' : 'Unpaid',
                    confirmActionTask.action === 'reject'
                  );
                  setConfirmActionTask(null);
                }
              }}
              variant={confirmActionTask?.action === 'approve' ? 'default' : 'destructive'}
            >
              {confirmActionTask?.action === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
