'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IconComponent } from './icon-component';
import { ChildUserSelectionModal } from './child-user-selection-modal';
import { TimeSince } from './time-since';
import { Task } from '@/app/types/task';
import { User } from '@/app/types/user';
import { CompletedTask } from '@/app/types/completedTask';
import { Trash2, SquareCheckBig, CheckSquare } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Fireworks } from './fireworks';
import { cn } from '@/lib/utils';
import { useUsers } from '@/components/context/user-context';
import { useMode } from '@/components/context/mode-context';
import Link from 'next/link';

export function TaskCompletion() {
  const { childUsers } = useUsers();
  const { hasFullAccess } = useMode();
  const [activeTasks, setActiveTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<CompletedTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [deleteTaskId, setDeleteTaskId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksRes, completedRes] = await Promise.all([
          fetch('./api/tasks?active=true'),
          fetch('./api/completed-tasks'),
        ]);

        if (!tasksRes.ok) throw new Error('Failed to fetch active tasks');
        if (!completedRes.ok) throw new Error('Failed to fetch completed tasks');

        const tasksData = await tasksRes.json();
        const completedData = await completedRes.json();

        setActiveTasks(tasksData);
        setCompletedTasks(
          completedData.filter((task: CompletedTask) => task.payment_status === 'Unpaid')
        );
      } catch (err) {
        const error = err as Error;
        setError(error.message || 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const playTaskSound = async (task: Task) => {
    if (task.sound_url && task.sound_url.trim() !== '') {
      try {
        let taskAudio = new Audio(`./sounds/tasks/${task.sound_url}.mp3`);
        await taskAudio.play().catch(() => {
          taskAudio = new Audio(`./sounds/tasks/${task.sound_url}.wav`);
          return taskAudio.play();
        });
      } catch {}
    }
  };

  const playUserSound = async (user: User): Promise<void> => {
    if (user.sound_url) {
      try {
        let userAudio = new Audio(`./sounds/users/${user.sound_url}.mp3`);
        try {
          await userAudio.play();
        } catch {
          userAudio = new Audio(`./sounds/users/${user.sound_url}.wav`);
          await userAudio.play();
        }
        // Wait for the sound to complete
        return new Promise<void>((resolve) => {
          userAudio.addEventListener('ended', () => resolve());
        });
      } catch {
        return Promise.resolve();
      }
    }
    return Promise.resolve();
  };

  const playCompletionCelebration = async () => {
    setShowFireworks(true);
    try {
      let applauseAudio = new Audio('./sounds/applause.mp3');
      await applauseAudio.play().catch(() => {
        applauseAudio = new Audio('./sounds/applause.wav');
        return applauseAudio.play();
      });
      await new Promise<void>((resolve) => {
        applauseAudio.addEventListener('ended', () => resolve());
      });
    } catch (_error) {
      // Error playing applause sound
    } finally {
      setShowFireworks(false);
    }
  };

  const handleTaskClick = (task: Task) => {
    if (!isProcessing) {
      playTaskSound(task);
      setSelectedTask(task);
      setIsModalOpen(true);
    }
  };

  const handleUserSelect = async (userId: number) => {
    if (selectedTask && !isProcessing) {
      setIsProcessing(true);
      const selectedUser = childUsers.find((user) => user.user_id === userId);
      if (!selectedUser) {
        setIsProcessing(false);
        return;
      }

      try {
        setIsModalOpen(false);

        // Wait for the user sound to complete before continuing
        await playUserSound(selectedUser);

        const response = await fetch('/api/completed-tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
            task_id: parseInt(selectedTask.task_id, 10),
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create completed task');
        }

        const newCompletedTask: CompletedTask = await response.json();

        setCompletedTasks((prevTasks) => [
          {
            ...newCompletedTask,
            task_title: selectedTask.title,
            user_name: selectedUser.name || '',
            icon_name: selectedTask.icon_name || undefined,
            user_icon: selectedUser.icon || '',
          },
          ...prevTasks,
        ]);

        setSelectedTask(null);

        await playCompletionCelebration();

        setTimeout(() => {
          setIsProcessing(false);
        }, 100);
      } catch (_err) {
        setError('Error creating completed task');
        setIsProcessing(false);
      }
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    setDeleteTaskId(taskId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteTask = async () => {
    if (deleteTaskId) {
      try {
        const response = await fetch(`./api/completed-tasks/${deleteTaskId}`, {
          method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to delete completed task');

        setCompletedTasks(completedTasks.filter((task) => task.c_task_id !== deleteTaskId));
        setIsDeleteDialogOpen(false);
        setDeleteTaskId(null);
      } catch (_err) {
        setError('Error deleting completed task');
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='h-[calc(100vh-4rem)] flex flex-col bg-background'>
      {/* Fixed Header */}
      <div className='p-8 bg-secondary'>
        <div className='flex items-center justify-between pb-6 border-b border-border'>
          <div className='flex items-center space-x-4'>
            <CheckSquare className='h-8 w-8 text-foreground' />
            <h1 className='text-3xl font-medium text-foreground'>Task Completion</h1>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className='flex-1 overflow-y-auto p-8 pt-4 bg-secondary'>
        <div className='space-y-8'>
          {/* Active Tasks Section */}
          <div className='space-y-4'>
            <h2 className='text-2xl font-semibold'>Active Tasks</h2>
            {activeTasks.length === 0 ? (
              <Card className='p-8 text-center bg-muted/50'>
                <CardContent className='space-y-4'>
                  <CheckSquare className='h-16 w-16 mx-auto text-muted-foreground' />
                  <h3 className='text-xl font-semibold text-muted-foreground'>
                    No Tasks Available
                  </h3>
                  <p className='text-muted-foreground'>
                    There are currently no active tasks to complete.
                  </p>
                  {hasFullAccess && (
                    <div className='pt-4'>
                      <Link href='/task-management'>
                        <Button variant='default'>Create Some Tasks</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {activeTasks.map((task) => (
                  <Card
                    key={task.task_id}
                    className={cn(
                      'w-full transition-all duration-300 cursor-pointer shadow-md',
                      'dark:hover:shadow-lg',
                      'bg-blue-100/50 hover:bg-blue-200/50',
                      'dark:bg-blue-900/10 dark:hover:bg-blue-800/20'
                    )}
                    onClick={() => handleTaskClick(task)}
                  >
                    <CardContent className='flex flex-col items-center p-3'>
                      <IconComponent
                        icon={task.icon_name}
                        className={cn('h-12 w-12 mb-1', 'text-blue-700', 'dark:text-blue-300')}
                      />
                      <h3
                        className={cn(
                          'text-md font-semibold mb-1',
                          'text-blue-900',
                          'dark:text-blue-100'
                        )}
                      >
                        {task.title}
                      </h3>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Completed Tasks Section */}
          <div className='space-y-4'>
            <h2 className='text-2xl font-semibold'>Completed Tasks</h2>
            <div className='space-y-4'>
              {completedTasks.map((task) => (
                <Card
                  key={task.c_task_id}
                  className={cn(
                    'w-full transition-all duration-300 shadow-md hover:shadow-lg',
                    'bg-card dark:bg-card'
                  )}
                >
                  <CardContent className='flex items-center justify-between p-3'>
                    <SquareCheckBig className='h-6 w-6 mr-2 text-green-600 dark:text-green-400' />

                    <Card
                      className={cn('flex-1 mr-2 shadow-sm', 'bg-blue-100/50 dark:bg-blue-900/10')}
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
                          className={cn('text-sm font-medium', 'text-blue-900 dark:text-blue-100')}
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
                            className={cn('h-6 w-6 mr-2', 'text-green-700 dark:text-green-300')}
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

                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => handleDeleteTask(task.c_task_id)}
                      className='ml-2'
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ChildUserSelectionModal
        isOpen={isModalOpen && !isProcessing}
        onClose={() => setIsModalOpen(false)}
        onSelectUser={handleUserSelect}
        childUsers={childUsers}
      />

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this completed task? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant='destructive' onClick={confirmDeleteTask}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showFireworks && <Fireworks />}
    </div>
  );
}
