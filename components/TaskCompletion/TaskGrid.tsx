'use client';

import React from 'react';
import { Task } from '@/app/types/task';
import { Brush, BookOpen, PawPrint } from 'lucide-react';

const iconMap: { [key: string]: React.ReactNode } = {
  broom: <Brush size={48} className="text-blue-500" />,
  book: <BookOpen size={48} className="text-blue-500" />,
  paw: <PawPrint size={48} className="text-blue-500" />,
};

interface TaskGridProps {
  tasks: Task[];
  onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string) => void;
  onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
  draggedTaskId: string | null;
}

export const TaskGrid: React.FC<TaskGridProps> = ({
  tasks,
  onDragStart,
  onDragEnd,
  draggedTaskId,
}) => {
  return (
    <div className="task-grid">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`task-item ${draggedTaskId === task.id ? 'dragging' : ''}`}
          draggable
          onDragStart={(e) => onDragStart(e, task.id)}
          onDragEnd={onDragEnd}
          data-task-id={task.id}
        >
          <div className={`task-icon bg-blue-100 ${draggedTaskId === task.id ? 'dragging' : ''}`}>
            {iconMap[task.iconName] || task.iconName}
          </div>
          <div className="task-title">{task.title}</div>
        </div>
      ))}
    </div>
  );
};
