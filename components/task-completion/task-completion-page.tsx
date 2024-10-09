'use client';

import React, { useState, useEffect } from 'react';
import { TaskGrid } from '@/components/task-completion/task-grid';
import { TouchTaskGrid } from '@/components/task-completion/touch-task-grid';
import { UserRow } from '@/components/task-completion/user-row';
import { TouchUserRow } from '@/components/task-completion/touch-user-row';
import { Task } from '@/types/task';
import { User } from '@/types/user';
import { useIsTouchDevice } from '@/hooks/useIsTouchDevice';
import { CheckSquareIcon } from 'lucide-react';
import { mockTasks, mockUsers } from '@/mocks/taskCompletionData';

export const TaskCompletionPage: React.FC = () => {
  const [tasks] = useState<Task[]>(mockTasks);
  const [users] = useState<User[]>(mockUsers);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [completedTaskUserId, setCompletedTaskUserId] = useState<string | null>(null);
  const isTouchDevice = useIsTouchDevice();

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
