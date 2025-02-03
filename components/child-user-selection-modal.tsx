import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { IconComponent } from './icon-component';
import { User } from '@/app/types/user';

interface ChildUserSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUser: (userId: number) => void;
  childUsers: User[];
}

export function ChildUserSelectionModal({
  isOpen,
  onClose,
  onSelectUser,
  childUsers,
}: ChildUserSelectionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Select User</DialogTitle>
        </DialogHeader>
        <div className='max-h-[60vh] overflow-y-auto pr-2'>
          <div className='grid grid-cols-2 gap-4'>
            {childUsers.map((user) => (
              <Card
                key={user.user_id}
                className='cursor-pointer hover:shadow-md transition-shadow'
                onClick={() => onSelectUser(user.user_id)}
              >
                <CardContent className='flex flex-col items-center justify-center p-4'>
                  <IconComponent icon={user.icon || 'default'} className='h-12 w-12 mb-2' />
                  <span className='text-sm font-medium'>{user.name}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
