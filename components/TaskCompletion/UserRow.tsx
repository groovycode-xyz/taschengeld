'use client';

import React from 'react';
import { User } from '@/app/types/user';
import { User as UserIcon } from 'lucide-react';

interface UserRowProps {
  users: User[];
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, userId: string) => void;
  completedTaskUserId: string | null;
}

export const UserRow: React.FC<UserRowProps> = ({ users, onDragOver, onDrop, completedTaskUserId }) => {
  return (
    <div className="user-row w-full">
      {users.map((user) => (
        <div
          key={user.id}
          className={`user-icon ${completedTaskUserId === user.id ? 'task-completed' : ''}`}
          data-user-id={user.id}
          onDragOver={onDragOver}
          onDrop={(e) => onDrop(e, user.id)}
        >
          <UserIcon size={48} className="text-red-500" />
          <span className="sr-only">{user.name}</span>
        </div>
      ))}
    </div>
  );
};