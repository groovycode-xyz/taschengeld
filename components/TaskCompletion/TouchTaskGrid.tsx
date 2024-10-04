'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Task } from '@/app/types/task';
import { Brush, BookOpen, PawPrint } from 'lucide-react';

const iconMap: { [key: string]: React.ReactNode } = {
  broom: <Brush size={48} className="text-blue-500" />,
  book: <BookOpen size={48} className="text-blue-500" />,
  paw: <PawPrint size={48} className="text-blue-500" />,
};

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
  const [draggedTask, setDraggedTask] = useState<{ id: string; x: number; y: number } | null>(null);
  const dragStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const draggedTaskRef = useRef<HTMLDivElement | null>(null);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent, taskId: string) => {
      const touch = e.touches[0];
      const iconElement = e.currentTarget.querySelector('.task-icon') as HTMLElement;
      const rect = iconElement.getBoundingClientRect();
      dragStartPosRef.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
      setDraggedTask({ id: taskId, x: touch.clientX, y: touch.clientY });
      onTaskSelect(taskId);
    },
    [onTaskSelect]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (draggedTask) {
        e.preventDefault();
        const touch = e.touches[0];
        setDraggedTask((prev) => (prev ? { ...prev, x: touch.clientX, y: touch.clientY } : null));
      }
    },
    [draggedTask]
  );

  const handleTouchEnd = useCallback(() => {
    setDraggedTask(null);
    dragStartPosRef.current = null;
  }, []);

  useEffect(() => {
    if (draggedTask) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [draggedTask]);

  return (
    <>
      <div className="task-grid touch-task-grid">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="task-item"
            onTouchStart={(e) => handleTouchStart(e, task.id)}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className={`task-icon bg-blue-100 ${draggedTaskId === task.id ? 'selected' : ''}`}>
              {iconMap[task.iconName] || task.iconName}
            </div>
            <div className="task-title">{task.title}</div>
          </div>
        ))}
      </div>
      {draggedTask &&
        createPortal(
          <div
            ref={draggedTaskRef}
            className="dragged-task-icon"
            style={{
              position: 'fixed',
              left: `${draggedTask.x - (dragStartPosRef.current?.x || 0)}px`,
              top: `${draggedTask.y - (dragStartPosRef.current?.y || 0)}px`,
              zIndex: 1000,
              pointerEvents: 'none',
            }}
          >
            {iconMap[tasks.find((t) => t.id === draggedTask.id)?.iconName || ''] || draggedTask.id}
          </div>,
          document.body
        )}
    </>
  );
};
