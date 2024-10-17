import React from 'react';
import { User } from '@/app/types/user';
import { IconComponent } from './icon-component';

interface UserCardProps {
  user: User;
  onClick: () => void;
}

export function UserCard({ user, onClick }: UserCardProps) {
  const bgColor = user.role === 'parent' ? 'bg-blue-100' : 'bg-green-100';
  const iconColor = user.role === 'parent' ? 'text-blue-700' : 'text-green-700';

  return (
    <div
      className={`${bgColor} p-4 rounded-lg shadow-md cursor-pointer transition-all hover:shadow-lg`}
      onClick={onClick}
    >
      <div className="flex items-center space-x-4">
        <div className={`${iconColor} w-16 h-16 flex items-center justify-center`}>
          <IconComponent icon={user.icon} className="w-12 h-12" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">{user.name}</h3>
          <p className="text-sm capitalize">{user.role}</p>
        </div>
      </div>
    </div>
  );
}
