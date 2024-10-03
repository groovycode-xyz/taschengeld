import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IconComponent } from './icon-component';

const taskIcons = [
  'baby', 'glasses', 'book-user', 'clipboard-pen-line', 'house', 'inbox', 'bird', 'bone', 
  'cat', 'dog', 'egg', 'fish', 'paw-print', 'rabbit', 'turtle', 'graduation-cap', 
  'warehouse', 'cuboid', 'palette', 'box', 'biceps-flexed', 'leafy-green', 'salad', 
  'star', 'music', 'music-2', 'music-4', 'paperclip', 'cooking-pot', 'soup', 'utensils', 
  'utensils-crossed', 'wheat', 'armchair', 'bed', 'fence', 'calculator', 'guitar', 
  'piano', 'flower', 'flower-2', 'sprout', 'shovel', 'shirt', 'shopping-basket', 
  'shopping-cart'
];

type SelectIconModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelectIcon: (icon: string) => void;
};

export function SelectIconModal({ isOpen, onClose, onSelectIcon }: SelectIconModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select an Icon</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-6 gap-2 py-4">
          {taskIcons.map((icon) => (
            <Button
              key={icon}
              variant="outline"
              className="h-10 w-10 p-0"
              onClick={() => {
                onSelectIcon(icon);
                onClose();
              }}
            >
              <IconComponent icon={icon} className="h-6 w-6" />
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}