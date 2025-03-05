import React from 'react';
import { Button } from '@/components/ui/button';
import { IconComponent } from './icon-component';

// We'll update this list later with the task-specific icons you provide
const taskIcons = ['broom', 'book', 'pencil', 'trash'];

type IconSelectorProps = {
  selectedIcon: string;
  onSelectIcon: (icon: string) => void;
};

export function IconSelector({ selectedIcon, onSelectIcon }: IconSelectorProps) {
  return (
    <div className='flex flex-wrap gap-2'>
      {taskIcons.map((icon) => (
        <Button
          key={icon}
          type='button'
          variant={selectedIcon === icon ? 'default' : 'outline'}
          className='p-2 h-10 w-10'
          onClick={() => onSelectIcon(icon)}
        >
          <IconComponent icon={icon} className='h-5 w-5' />
        </Button>
      ))}
    </div>
  );
}
