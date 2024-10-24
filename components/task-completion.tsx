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
import { ClipboardListIcon, Trash2, SquareCheckBig } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

export function TaskCompletion() {
  const [activeTasks, setActiveTasks] = useState<Task[]>([]);
  const [childUsers, setChildUsers] = useState<User[]>([]);
  const [completedTasks, setCompletedTasks] = useState<CompletedTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [deleteTaskId, setDeleteTaskId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksRes, usersRes, completedRes] = await Promise.all([
          fetch('/api/active-tasks'),
          fetch('/api/child-users'),
          fetch('/api/completed-tasks'),
        ]);

        if (!tasksRes.ok) throw new Error('Failed to fetch active tasks');
        if (!usersRes.ok) throw new Error('Failed to fetch child users');
        if (!completedRes.ok) throw new Error('Failed to fetch completed tasks');

        const [tasksData, usersData, completedData] = await Promise.all([
          tasksRes.json(),
          usersRes.json(),
          completedRes.json(),
        ]);

        setActiveTasks(tasksData);
        setChildUsers(usersData);
        setCompletedTasks(completedData.filter((task) => task.payment_status === 'Unpaid'));
      } catch (err) {
        const error = err as Error;
        setError(error.message || 'An error occurred');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleUserSelect = async (userId: number) => {
    if (selectedTask) {
      try {
        const response = await fetch('/api/completed-tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
            task_id: selectedTask.task_id,
          }),
        });

        if (!response.ok) throw new Error('Failed to create completed task');

        const newCompletedTask: CompletedTask = await response.json();
        console.log('New completed task:', newCompletedTask);

        setCompletedTasks((prevTasks) => [
          {
            ...newCompletedTask,
            task_title: selectedTask.title,
            user_name: childUsers.find((user) => user.user_id === userId)?.name || '',
            icon_name: selectedTask.icon_name,
            user_icon: childUsers.find((user) => user.user_id === userId)?.icon || '',
          },
          ...prevTasks,
        ]);

        setIsModalOpen(false);
        setSelectedTask(null);
      } catch (err) {
        setError('Error creating completed task');
        console.error(err);
      }
    }
  };

  const clearCompletedTasks = async () => {
    try {
      const response = await fetch('/api/completed-tasks/clear', { method: 'POST' });
      if (!response.ok) throw new Error('Failed to clear completed tasks');
      setCompletedTasks([]);
    } catch (err) {
      setError('Error clearing completed tasks');
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    setDeleteTaskId(taskId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteTask = async () => {
    if (deleteTaskId) {
      try {
        const response = await fetch(`/api/completed-tasks/${deleteTaskId}`, {
          method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to delete completed task');

        setCompletedTasks(completedTasks.filter((task) => task.c_task_id !== deleteTaskId));
        setIsDeleteDialogOpen(false);
        setDeleteTaskId(null);
      } catch (err) {
        setError('Error deleting completed task');
        console.error(err);
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center">
          <ClipboardListIcon className="mr-3 h-10 w-10" />
          Task Completion
        </h1>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Active Tasks</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {activeTasks.map((task) => (
            <Card
              key={task.task_id}
              className="w-full hover:shadow-lg transition-shadow duration-300 cursor-pointer bg-blue-100 hover:bg-blue-200"
              onClick={() => handleTaskClick(task)}
            >
              <CardContent className="flex flex-col items-center p-4">
                <IconComponent icon={task.icon_name} className="h-16 w-16 mb-2 text-blue-600" />
                <h3 className="text-lg font-semibold mb-2 text-blue-600">{task.title}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Completed Tasks</h2>
        <div className="space-y-4">
          {completedTasks.map((task) => (
            <Card
              key={task.c_task_id}
              className="w-full hover:shadow-lg transition-shadow duration-300 bg-white"
            >
              <CardContent className="flex items-center justify-between p-4">
                {/* SquareCheckBig Icon */}
                <SquareCheckBig className="h-8 w-8 mr-2 text-green-500" />

                {/* Task Icon */}
                <Card className="flex-1 mr-2 bg-blue-50 shadow-sm">
                  <CardContent className="flex items-center p-2">
                    {task.icon_name ? (
                      <IconComponent icon={task.icon_name} className="h-8 w-8 mr-2" />
                    ) : (
                      <IconComponent
                        icon="default-task-icon"
                        className="h-8 w-8 mr-2 text-gray-400"
                      />
                    )}
                    <span className="text-sm font-medium">{task.task_title}</span>
                  </CardContent>
                </Card>

                {/* User Icon */}
                <Card className="flex-1 mx-2 bg-green-50 shadow-sm">
                  <CardContent className="flex items-center p-2">
                    {task.user_icon ? (
                      <IconComponent icon={task.user_icon} className="h-8 w-8 mr-2" />
                    ) : (
                      <IconComponent
                        icon="default-user-icon"
                        className="h-8 w-8 mr-2 text-gray-400"
                      />
                    )}
                    <span className="text-sm font-medium">{task.user_name}</span>
                  </CardContent>
                </Card>

                {/* Time Since Created */}
                <Card className="flex-1 ml-2 bg-gray-50 shadow-sm">
                  <CardContent className="p-2 text-center">
                    <TimeSince date={task.created_at} />
                  </CardContent>
                </Card>

                {/* Delete Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteTask(task.c_task_id)}
                  className="ml-2"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <ChildUserSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectUser={handleUserSelect}
        childUsers={childUsers}
      />

      <Button onClick={clearCompletedTasks} className="mt-4">
        Clear Completed Tasks
      </Button>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this completed task? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteTask}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
