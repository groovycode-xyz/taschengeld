import React from 'react';
import { Task } from '@/types/task';
import { IconComponent } from '../icon-component';

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
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {tasks.map((task) => (
        <div
          key={task.task_id}
          onTouchStart={() => onTaskSelect(task.task_id)}
          className={`p-4 border rounded flex flex-col items-center justify-center ${
            draggedTaskId === task.task_id ? 'opacity-50' : ''
          }`}
        >
          <IconComponent icon={task.icon_name} className="w-16 h-16 mb-2 text-blue-500" />
          <h3 className="text-sm text-center">{task.title}</h3>
        </div>
      ))}
    </div>
  );
};
