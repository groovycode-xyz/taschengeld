import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { User } from '@/app/types/user';
import { IconComponent } from './icon-component';

type ChildUserSelectionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelectUser: (userId: number) => void;
  childUsers: User[];
};

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
          <DialogTitle>Select Child</DialogTitle>
        </DialogHeader>
        <div className='grid grid-cols-2 gap-4'>
          {childUsers.map((user) => (
            <Button
              key={user.user_id}
              onClick={() => onSelectUser(parseInt(user.user_id.toString(), 10))}
              className='flex flex-col items-center justify-center h-32 w-full p-2 bg-green-100 hover:bg-green-200 text-green-800'
            >
              <IconComponent icon={user.icon} className='h-12 w-12 mb-2' />
              <span className='text-sm font-medium text-center'>{user.name}</span>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
