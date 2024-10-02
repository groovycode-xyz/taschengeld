'use client';  // Add this line at the top of the file

import React, { useState, useEffect } from 'react';
import { TaskGrid } from '@/components/TaskCompletion/TaskGrid';
import { TouchTaskGrid } from '@/components/TaskCompletion/TouchTaskGrid';
import { UserRow } from '@/components/TaskCompletion/UserRow';
import { TouchUserRow } from '@/components/TaskCompletion/TouchUserRow';
import { Task } from '@/app/types/task';
import { User } from '@/app/types/user';
import { useIsTouchDevice } from '@/hooks/useIsTouchDevice';

const mockTasks: Task[] = [
  { id: '1', title: 'Clean Room', iconName: 'broom', soundUrl: '/sounds/clean.mp3', payoutValue: 5 },
  { id: '2', title: 'Do Homework', iconName: 'book', soundUrl: '/sounds/homework.mp3', payoutValue: 3 },
  { id: '3', title: 'Walk Dog', iconName: 'paw', soundUrl: '/sounds/dog.mp3', payoutValue: 4 },
];

const mockUsers: User[] = [
  { id: '1', name: 'Alice', iconName: 'girl', soundUrl: '/sounds/alice.mp3', role: 'child' },
  { id: '2', name: 'Bob', iconName: 'boy', soundUrl: '/sounds/bob.mp3', role: 'child' },
];

export const TaskCompletionPage: React.FC = () => {
  const [tasks] = useState<Task[]>(mockTasks);
  const [users] = useState<User[]>(mockUsers);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [completedTaskUserId, setCompletedTaskUserId] = useState<string | null>(null);
  const isTouchDevice = useIsTouchDevice();

  useEffect(() => {
    if (isTouchDevice && draggedTaskId) {
      document.body.classList.add('dragging');
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    } else {
      document.body.classList.remove('dragging');
    }

    return () => {
      document.body.classList.remove('dragging');
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isTouchDevice, draggedTaskId]);

  const handleTouchMove = (e: TouchEvent) => {
    if (draggedTaskId) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (draggedTaskId) {
      const touch = e.changedTouches[0];
      const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
      const userElement = dropTarget?.closest('.user-icon');
      if (userElement) {
        const userId = userElement.getAttribute('data-user-id');
        if (userId) {
          handleTaskCompletion(draggedTaskId, userId);
        }
      }
      setDraggedTaskId(null);
    }
  };

  const handleTaskCompletion = (taskId: string, userId: string) => {
    console.log(`Task ${taskId} assigned to user ${userId}`);
    setCompletedTaskUserId(userId);
    setTimeout(() => {
      setCompletedTaskUserId(null);
    }, 2000);
  };

  const handleTaskSelect = (taskId: string) => {
    setDraggedTaskId(taskId);
  };

  const handleTaskDrop = (userId: string) => {
    if (draggedTaskId) {
      handleTaskCompletion(draggedTaskId, userId);
      setDraggedTaskId(null);
    }
  };

  return (
    <div className="task-completion-page">
      <h2 className="text-2xl font-bold mb-4">Task Completion</h2>
      <div className="flex-1 overflow-auto mb-4">
        {isTouchDevice ? (
          <TouchTaskGrid 
            tasks={tasks} 
            onTaskSelect={handleTaskSelect}
            draggedTaskId={draggedTaskId}
          />
        ) : (
          <TaskGrid 
            tasks={tasks} 
            onDragStart={(e, taskId) => {
              setDraggedTaskId(taskId);
              e.dataTransfer.setData('text/plain', taskId);
            }}
            onDragEnd={() => setDraggedTaskId(null)}
            draggedTaskId={draggedTaskId}
          />
        )}
      </div>
      {isTouchDevice ? (
        <TouchUserRow 
          users={users}
          onTaskDrop={handleTaskDrop}
          completedTaskUserId={completedTaskUserId}
        />
      ) : (
        <UserRow 
          users={users}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e, userId) => {
            e.preventDefault();
            const taskId = e.dataTransfer.getData('text/plain');
            handleTaskCompletion(taskId, userId);
          }}
          completedTaskUserId={completedTaskUserId}
        />
      )}
    </div>
  );
};