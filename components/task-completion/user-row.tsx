'use client';

import React from 'react';
import { User } from '@/types/user'; // Update this import

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
    <div className="flex justify-around mt-4">
      {users.map((user) => (
        <div
          key={user.id}
          onDragOver={onDragOver}
          onDrop={(e) => onDrop(e, user.id)}
          className={`p-4 border rounded transition-all duration-200 ${
            completedTaskUserId === user.id ? 'bg-green-200 scale-105' : 'hover:bg-gray-100'
          }`}
        >
          <h3 className="font-bold">{user.name}</h3>
          <p className="text-sm">{user.role}</p>
        </div>
      ))}
    </div>
  );
};
