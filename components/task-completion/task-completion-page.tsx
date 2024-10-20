'use client';

import React, { useState, useEffect } from 'react';
import { TaskGrid } from '@/components/task-completion/task-grid';
import { TouchTaskGrid } from '@/components/task-completion/touch-task-grid';
import { UserRow } from '@/components/task-completion/user-row';
import { TouchUserRow } from '@/components/task-completion/touch-user-row';
import { Task } from '@/types/task';
import { User } from '@/types/user'; // Update this import
import { useIsTouchDevice } from '@/hooks/useIsTouchDevice';
import { CheckSquareIcon } from 'lucide-react';

export const TaskCompletionPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [completedTaskUserId, setCompletedTaskUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isTouchDevice = useIsTouchDevice();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/tasks');
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setError('Failed to load tasks. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        const childUsers = data.filter((user: User) => user.role === 'child');
        setUsers(childUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to load users. Please try again later.');
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    console.log('isTouchDevice:', isTouchDevice);
  }, [isTouchDevice]);

  const handleTaskCompletion = (taskId: string, userId: string) => {
    console.log(`Task ${taskId} assigned to user ${userId}`);
    setCompletedTaskUserId(userId);
    setTimeout(() => {
      setCompletedTaskUserId(null);
    }, 2000);
  };

  const handleTaskSelect = (taskId: string) => {
    console.log('Task selected:', taskId);
    setDraggedTaskId(taskId);
  };

  const handleTaskDrop = (userId: string) => {
    console.log('Task dropped on user:', userId);
    if (draggedTaskId) {
      handleTaskCompletion(draggedTaskId, userId);
      setDraggedTaskId(null);
    }
  };

  const handleTaskDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
    console.log('Task drag started:', taskId);
    setDraggedTaskId(taskId);
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleUserDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    console.log('Dragging over user');
  };

  const handleUserDrop = (e: React.DragEvent<HTMLDivElement>, userId: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    console.log(`Dropped task ${taskId} on user ${userId}`);
    handleTaskCompletion(taskId, userId);
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (isLoading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div className="task-completion-page p-4">
      <h2 className="text-3xl font-bold mb-4 flex items-center">
        <CheckSquareIcon className="mr-3 h-10 w-10" />
        Task Completion
      </h2>
      <div className="flex-1 overflow-auto mb-4 border p-4 rounded">
        {isTouchDevice ? (
          <TouchTaskGrid
            tasks={tasks}
            onTaskSelect={handleTaskSelect}
            draggedTaskId={draggedTaskId}
          />
        ) : (
          <TaskGrid
            tasks={tasks}
            onDragStart={handleTaskDragStart}
            onDragEnd={() => setDraggedTaskId(null)}
            draggedTaskId={draggedTaskId}
          />
        )}
      </div>
      <div className="border p-4 rounded">
        {isTouchDevice ? (
          <TouchUserRow
            users={users}
            onTaskDrop={handleTaskDrop}
            completedTaskUserId={completedTaskUserId}
          />
        ) : (
          <UserRow
            users={users}
            onDragOver={handleUserDragOver}
            onDrop={handleUserDrop}
            completedTaskUserId={completedTaskUserId}
          />
        )}
      </div>
    </div>
  );
};
