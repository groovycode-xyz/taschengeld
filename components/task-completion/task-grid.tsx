'use client';

import React from 'react';
import { Task } from '@/types/task';

interface TaskGridProps {
  tasks: Task[];
  onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string) => void;
  onDragEnd: () => void;
  draggedTaskId: string | null;
}

export const TaskGrid: React.FC<TaskGridProps> = ({
  tasks,
  onDragStart,
  onDragEnd,
  draggedTaskId,
}) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          draggable
          onDragStart={(e) => onDragStart(e, task.id)}
          onDragEnd={onDragEnd}
          className={`p-4 border rounded cursor-move transition-all duration-200 ${
            draggedTaskId === task.id ? 'opacity-50 scale-105' : 'hover:shadow-md'
          }`}
        >
          <h3 className="font-bold">{task.title}</h3>
          <p className="text-sm">{task.description}</p>
        </div>
      ))}
    </div>
  );
};
