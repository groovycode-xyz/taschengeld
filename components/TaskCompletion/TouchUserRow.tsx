'use client';

import React from 'react';
import { User } from '@/app/types/user';
import { User as UserIcon } from 'lucide-react';

interface TouchUserRowProps {
  users: User[];
  onTaskDrop: (userId: string) => void;
  completedTaskUserId: string | null;
}

export const TouchUserRow: React.FC<TouchUserRowProps> = ({
  users,
  onTaskDrop,
  completedTaskUserId,
}) => {
  return (
    <div className="user-row touch-user-row w-full">
      {users.map((user) => (
        <div
          key={user.id}
          className={`user-icon ${completedTaskUserId === user.id ? 'task-completed' : ''}`}
          onTouchEnd={() => onTaskDrop(user.id)}
        >
          <UserIcon size={48} className="text-red-500" />
          <span className="sr-only">{user.name}</span>
        </div>
      ))}
    </div>
  );
};
