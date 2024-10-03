import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { IconComponent } from './icon-component';
import { User } from '@/app/types/user';

type UserCardProps = {
  user: User;
  onClick: () => void;
};

export function UserCard({ user, onClick }: UserCardProps) {
  const cardColorClass = user.role === 'parent' ? 'bg-blue-50' : 'bg-green-50';

  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${cardColorClass}`}
      onClick={onClick}
    >
      <CardContent className="p-4 flex items-center space-x-4">
        <div className="h-16 w-16 flex-shrink-0">
          <IconComponent icon={user.icon} className="h-full w-full" />
        </div>
        <div className="flex-grow">
          <h3 className="text-lg font-bold">{user.name}</h3>
          <p className="text-sm text-gray-600 capitalize">{user.role}</p>
        </div>
      </CardContent>
    </Card>
  );
}