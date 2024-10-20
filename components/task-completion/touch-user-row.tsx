'use client';

import React from 'react';
import { User } from '@/types/user'; // Update this import

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
    <div className="flex justify-around mt-4">
      {users.map((user) => (
        <div
          key={user.id}
          onTouchEnd={() => onTaskDrop(user.id)}
          className={`p-4 border rounded ${completedTaskUserId === user.id ? 'bg-green-200' : ''}`}
        >
          <h3>{user.name}</h3>
          <p>{user.role}</p>
        </div>
      ))}
    </div>
  );
};
