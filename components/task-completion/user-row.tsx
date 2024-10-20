'use client';

import React from 'react';
import { User } from '@/types/user';
import { IconComponent } from '../icon-component';

interface UserRowProps {
  users: User[];
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, userId: string) => void;
  completedTaskUserId: string | null;
}

export const UserRow: React.FC<UserRowProps> = ({
  users,
  onDragOver,
  onDrop,
  completedTaskUserId,
}) => {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {users.map((user) => (
        <div
          key={user.id}
          onDragOver={onDragOver}
          onDrop={(e) => onDrop(e, user.id)}
          className={`p-4 border rounded transition-all duration-200 flex flex-col items-center justify-center w-24 h-24 ${
            completedTaskUserId === user.id
              ? 'bg-green-200 scale-105'
              : 'hover:shadow-md cursor-move'
          }`}
        >
          <IconComponent icon={user.icon} className="w-16 h-16 mb-2 text-blue-500" />
          <h3 className="text-xs text-center">{user.name}</h3>
        </div>
      ))}
    </div>
  );
};
