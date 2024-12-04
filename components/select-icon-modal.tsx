// SelectIconModal Component
// This modal allows users to select an icon from a predefined static list to associate with a TASK.

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { IconComponent } from './icon-component';
import { cn } from '@/lib/utils';

const taskIcons = [
  'asterisk',
  'apple',
  'archive',
  'armchair',
  'atom',
  'axe',
  'backpack',
  'baggage-claim',
  'banana',
  'bath',
  'beaker',
  'biceps-flexed',
  'bird',
  'bike',
  'binoculars',
  'book-user',
  'bone',
  'blocks',
  'boxes',
  'briefcase-business',
  'brush',
  'bug',
  'bus',
  'car',
  'carrot',
  'castle',
  'chef-hat',
  'cherry',
  'clipboard-list',
  'cloud-rain',
  'codepen',
  'codesandbox',
  'coffee',
  'cooking-pot',
  'croissant',
  'cuboid',
  'crown',
  'cylinder',
  'dog',
  'door-open',
  'drafting-compass',
  'droplets',
  'drumstick',
  'ear',
  'eraser',
  'fan',
  'file',
  'flame',
  'flame-kindling',
  'flashlight',
  'footprints',
  'gift',
  'glasses',
  'graduation-cap',
  'guitar',
  'hammer',
  'hand',
  'heater',
  'hourglass',
  'inbox',
  'key-round',
  'leaf',
  'leafy-green',
  'lightbulb',
  'lightbulb-off',
  'milk',
  'moon',
  'mountain-snow',
  'music',
  'music-2',
  'music-3',
  'music-4',
  'notebook-pen',
  'nut',
  'palette',
  'paintbrush',
  'paperclip',
  'paw-print',
  'pencil',
  'person-standing',
  'piggy-bank',
  'piano',
  'pickaxe',
  'pipette',
  'pizza',
  'pocket-knife',
  'pokemon',
  'puzzle',
  'rabbit',
  'rainbow',
  'rat',
  'receipt-text',
  'recycle',
  'ribbon',
  'rocket',
  'rocking-chair',
  'ruler',
  'salad',
  'scissors',
  'scissors-line-dashed',
  'shirt',
  'shopping-bag',
  'shopping-basket',
  'shopping-cart',
  'shovel',
  'shower-head',
  'snail',
  'snowflake',
  'sofa',
  'soup',
  'spray-can',
  'sprout',
  'squirrel',
  'star',
  'thumbs-up',
  'timer',
  'tractor',
  'traffic-cone',
  'trash-2',
  'tree-palm',
  'tree-pine',
  'trees',
  'truck',
  'turtle',
  'umbrella',
  'utensils',
  'utensils-crossed',
  'warehouse',
  'watch',
  'webhook',
  'weight',
  'wind',
  'wine',
  'wine-off',
  'worm',
  'wheat',
  'wrench',
];

type SelectIconModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelectIcon: (icon: string) => void;
  currentIcon: string;
};

export function SelectIconModal({
  isOpen,
  onClose,
  onSelectIcon,
  currentIcon,
}: SelectIconModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[600px] flex flex-col h-[80vh]'>
        <DialogHeader className='flex-shrink-0'>
          <DialogTitle>Select an Icon</DialogTitle>
        </DialogHeader>
        
        <div className='flex-1 overflow-y-auto overflow-x-hidden'>
          <div className='grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 py-4 px-1'>
            {taskIcons.map((icon) => (
              <Button
                key={icon}
                type='button'
                variant='outline'
                onClick={() => {
                  onSelectIcon(icon);
                  onClose();
                }}
                className={cn(
                  'p-2 h-16 w-16 flex justify-center items-center border-2',
                  currentIcon === icon 
                    ? 'border-blue-600 bg-blue-100 shadow-md ring-2 ring-blue-400 ring-offset-2' 
                    : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                )}
              >
                <IconComponent 
                  icon={icon} 
                  className={cn(
                    'h-8 w-8',
                    currentIcon === icon && 'text-blue-600'
                  )} 
                />
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
