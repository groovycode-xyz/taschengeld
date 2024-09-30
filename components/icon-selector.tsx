import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BeakerIcon, 
  BookOpenIcon, 
  BriefcaseIcon, 
  CalculatorIcon, 
  CalendarIcon 
} from '@heroicons/react/24/solid';

const icons = [
  { name: 'beaker', icon: BeakerIcon },
  { name: 'book', icon: BookOpenIcon },
  { name: 'briefcase', icon: BriefcaseIcon },
  { name: 'calculator', icon: CalculatorIcon },
  { name: 'calendar', icon: CalendarIcon },
  // Add more icons as needed
];

interface IconSelectorProps {
  selectedIcon: string;
  onSelectIcon: (iconName: string) => void;
}

export function IconSelector({ selectedIcon, onSelectIcon }: IconSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempSelectedIcon, setTempSelectedIcon] = useState(selectedIcon);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setTempSelectedIcon(selectedIcon);
    }
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling up
    onSelectIcon(tempSelectedIcon);
    setIsOpen(false);
  };

  const SelectedIconComponent = icons.find(i => i.name === selectedIcon)?.icon || BeakerIcon;

  return (
    <>
      <Button 
        type="button" // Prevent form submission
        variant="outline" 
        onClick={(e) => {
          e.preventDefault(); // Prevent form submission
          setIsOpen(true);
        }}
        className="w-16 h-16 p-2"
      >
        <SelectedIconComponent className="w-full h-full" />
      </Button>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent onClick={(e) => e.stopPropagation()} className="sm:max-w-[425px]"> {/* Prevent closing when clicking inside */}
          <DialogHeader>
            <DialogTitle>Select an Icon</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[300px] p-4">
            <div className="grid grid-cols-4 gap-4">
              {icons.map((icon) => {
                const IconComponent = icon.icon;
                return (
                  <Button
                    key={icon.name}
                    type="button" // Prevent form submission
                    variant="outline"
                    className={`p-2 aspect-square ${
                      tempSelectedIcon === icon.name 
                        ? 'bg-primary text-primary-foreground border-primary' 
                        : 'hover:bg-accent hover:text-accent-foreground'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent event from bubbling up
                      setTempSelectedIcon(icon.name);
                    }}
                  >
                    <IconComponent className="w-full h-full" />
                  </Button>
                );
              })}
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}>Cancel</Button>
            <Button type="button" onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}