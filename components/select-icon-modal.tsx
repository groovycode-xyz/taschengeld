// SelectIconModal Component
// This modal allows users to select an icon from a predefined static list to associate with a TASK.

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { IconComponent } from './icon-component';

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
};

export function SelectIconModal({ isOpen, onClose, onSelectIcon }: SelectIconModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='bg-white sm:max-w-[425px] max-h-[80vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Select an Icon</DialogTitle>
        </DialogHeader>
        <div className='grid grid-cols-6 gap-2 py-4'>
          {taskIcons.map((icon) => (
            <Button
              key={icon}
              variant='outline'
              className='h-10 w-10 p-0'
              onClick={() => {
                onSelectIcon(icon);
                onClose();
              }}
            >
              <IconComponent icon={icon} className='h-6 w-6' />
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
