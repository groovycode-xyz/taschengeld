import React, { useState, useEffect, useCallback } from 'react';
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

type SoundType = 'task' | 'user';

type SoundSelectorModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (sound: string | null) => void;
  currentSound: string | null;
  type: SoundType;
};

export function SoundSelectorModal({
  isOpen,
  onClose,
  onSelect,
  currentSound,
  type,
}: SoundSelectorModalProps) {
  const [sounds, setSounds] = useState<Sound[]>([]);
  const [selectedSound, setSelectedSound] = useState<string | null>(currentSound);

  useEffect(() => {
    setSelectedSound(currentSound);
  }, [isOpen, currentSound]);

  const fetchSounds = useCallback(async () => {
    try {
      const endpoint = type === 'task' ? '/api/task-sounds' : '/api/user-sounds';
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error('Failed to fetch sounds');
      }
      const data = await response.json();
      setSounds(data);
    } catch (error) {
      // Error fetching sounds
    }
  }, [type]);

  useEffect(() => {
    if (isOpen) {
      fetchSounds();
    }
  }, [isOpen, fetchSounds]);

  const playSound = (sound: Sound) => {
    const basePath = type === 'task' ? '/sounds/tasks/' : '/sounds/users/';
    const audio = new Audio(`${basePath}${sound.name}${sound.extension}`);
    audio.play().catch((error) => {
      // Error playing sound
    });
  };

  const handleSave = () => {
    onSelect(selectedSound);
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
            <div
              key={sound.name}
              className={`flex items-center justify-between p-2 rounded-md border cursor-pointer ${
                selectedSound === sound.name
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'border-gray-200 hover:bg-gray-100'
              }`}
              onClick={() => setSelectedSound(sound.name)}
            >
              <span className='font-medium'>{sound.name.toUpperCase()}</span>
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
            </div>
          ))}
        </div>
        <DialogFooter className='flex-shrink-0 px-4 py-2 space-x-2'>
          <Button variant='outline' onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant='outline' onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
