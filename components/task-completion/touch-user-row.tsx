'use client';

import React from 'react';
import { User } from '@/types/user';
import { IconComponent } from '../icon-component';

interface TouchUserRowProps {
  users: User[];
  onTap: (userId: string) => void;
  completedTaskUserId: string | null;
}

export const TouchUserRow: React.FC<TouchUserRowProps> = ({
  users,
  onTap,
  completedTaskUserId,
}) => {
  return (
    <div className="flex justify-around mt-4 space-x-4">
      {users.map((user) => (
        <div
          key={user.id}
          onClick={() => onTap(user.id)}
          className={`p-4 border rounded transition-all duration-200 flex flex-col items-center justify-center w-24 h-24 ${
            completedTaskUserId === user.id ? 'bg-green-200 scale-105' : 'active:bg-gray-200'
          }`}
        >
          <IconComponent icon={user.icon} className="w-12 h-12 mb-2 text-blue-500" />
          <h3 className="text-xs text-center">{user.name}</h3>
        </div>
      ))}
    </div>
  );
};
