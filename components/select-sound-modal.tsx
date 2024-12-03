import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

type Sound = {
  name: string;
  extension: string;
};

type SelectSoundModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelectSound: (sound: string | null) => void;
  currentSound: string | null;
};

export function SelectSoundModal({
  isOpen,
  onClose,
  onSelectSound,
  currentSound,
}: SelectSoundModalProps) {
  const [sounds, setSounds] = useState<Sound[]>([]);
  const [selectedSound, setSelectedSound] = useState<string | null>(currentSound);

  useEffect(() => {
    setSelectedSound(currentSound);
  }, [isOpen, currentSound]);

  useEffect(() => {
    if (isOpen) {
      fetchSounds();
    }
  }, [isOpen]);

  async function fetchSounds() {
    try {
      const response = await fetch('/api/task-sounds');
      if (!response.ok) {
        throw new Error('Failed to fetch sounds');
      }
      const data = await response.json();
      setSounds(data);
    } catch (error) {
      console.error('Error fetching sounds:', error);
    }
  }

  const playSound = (sound: Sound) => {
    const audio = new Audio(`/sounds/tasks/${sound.name}${sound.extension}`);
    audio.play().catch((error) => {
      console.error('Error playing sound:', error);
    });
  };

  const handleSave = () => {
    onSelectSound(selectedSound);
    onClose();
  };

  const handleCancel = () => {
    setSelectedSound(currentSound);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className='bg-white border-none shadow-lg max-h-[80vh] flex flex-col'>
        <DialogHeader className='flex-shrink-0'>
          <DialogTitle>Select a Sound</DialogTitle>
        </DialogHeader>
        <div className='flex-grow overflow-y-auto space-y-2 p-4'>
          <Button
            variant={selectedSound === null ? 'default' : 'outline'}
            className={`w-full justify-between ${
              selectedSound === null 
                ? 'bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-600'
                : 'hover:bg-gray-100'
            }`}
            onClick={() => setSelectedSound(null)}
          >
            No Sound
          </Button>
          {sounds.map((sound) => (
            <Button
              key={sound.name}
              variant={selectedSound === sound.name ? 'default' : 'outline'}
              className={`w-full justify-between ${
                selectedSound === sound.name 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-600'
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => setSelectedSound(sound.name)}
            >
              <span>{sound.name.toUpperCase()}</span>
              <Button
                size='sm'
                variant='ghost'
                onClick={(e) => {
                  e.stopPropagation();
                  playSound(sound);
                }}
                className={`ml-2 ${
                  selectedSound === sound.name 
                    ? 'text-white hover:bg-blue-700'
                    : 'text-blue-600 hover:bg-gray-100'
                }`}
              >
                <Play className='h-4 w-4' />
              </Button>
            </Button>
          ))}
        </div>
        <DialogFooter className='flex-shrink-0 px-4 py-2 space-x-2'>
          <Button variant='outline' onClick={handleCancel}>Cancel</Button>
          <Button variant='outline' onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
