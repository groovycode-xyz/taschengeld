'use client';

import React from 'react';
import { Task } from '@/types/task';
import { IconComponent } from '../icon-component';

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
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          draggable
          onDragStart={(e) => onDragStart(e, task.id)}
          onDragEnd={onDragEnd}
          className={`p-4 border rounded cursor-move transition-all duration-200 flex flex-col items-center justify-center ${
            draggedTaskId === task.id ? 'opacity-50 scale-105' : 'hover:shadow-md'
          }`}
        >
          <IconComponent icon={task.icon_name} className="w-16 h-16 mb-2 text-blue-500" />
          <h3 className="text-xs text-center">{task.title}</h3>
        </div>
      ))}
    </div>
  );
};
