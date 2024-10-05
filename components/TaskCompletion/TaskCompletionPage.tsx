'use client'; // Add this line at the top of the file

import React, { useState, useEffect } from 'react';
import { TaskGrid } from '@/components/TaskCompletion/TaskGrid';
import { TouchTaskGrid } from '@/components/TaskCompletion/TouchTaskGrid';
import { UserRow } from '@/components/TaskCompletion/UserRow';
import { TouchUserRow } from '@/components/TaskCompletion/TouchUserRow';
import { Task } from '@/types/task';
import { User } from '@/app/types/user'; // {{ Corrected import path }}
import { useIsTouchDevice } from '@/hooks/useIsTouchDevice';
import { CheckSquareIcon } from 'lucide-react'; // Add this import

// Update mock data to match the Task type
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Clean Room',
    description: 'Tidy up and organize your bedroom',
    iconName: 'broom',
    soundUrl: '/sounds/clean.mp3',
    payoutValue: 5,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'Do Homework',
    description: 'Complete all assigned homework',
    iconName: 'book',
    soundUrl: '/sounds/homework.mp3',
    payoutValue: 3,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    title: 'Walk Dog',
    description: 'Take the dog for a 30-minute walk',
    iconName: 'paw',
    soundUrl: '/sounds/dog.mp3',
    payoutValue: 4,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Update mock users to match the new data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'James',
    sound: null,
    birthday: '1971-11-03',
    role: 'parent',
    icon: 'user-icon',
    iconName: 'user-icon',
  },
  {
    id: '2',
    name: 'Rebekka',
    sound: null,
    birthday: '1985-10-12',
    role: 'parent',
    icon: 'user-icon',
    iconName: 'user-icon',
  },
  {
    id: '3',
    name: 'Eliana',
    sound: null,
    birthday: '2015-03-26',
    role: 'child',
    icon: 'user-icon',
    iconName: 'user-icon',
  },
  {
    id: '4',
    name: 'Ariel',
    sound: null,
    birthday: '2016-12-01',
    role: 'child',
    icon: 'user-icon',
    iconName: 'user-icon',
  },
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
      <h2 className="text-3xl font-bold mb-4 flex items-center">
        <CheckSquareIcon className="mr-3 h-10 w-10" />
        Task Completion
      </h2>
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
