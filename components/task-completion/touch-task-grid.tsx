import React from 'react';
import { Task } from '@/types/task';

interface TouchTaskGridProps {
  tasks: Task[];
  onTaskSelect: (taskId: string) => void;
  draggedTaskId: string | null;
}

export const TouchTaskGrid: React.FC<TouchTaskGridProps> = ({
  tasks,
  onTaskSelect,
  draggedTaskId,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          onTouchStart={() => onTaskSelect(task.id)}
          className={`p-4 border rounded ${draggedTaskId === task.id ? 'opacity-50' : ''}`}
        >
          <h3>{task.title}</h3>
          <p>{task.description}</p>
        </div>
      ))}
    </div>
  );
};
