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

type SelectUserSoundModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelectSound: (sound: string | null) => void;
  currentSound: string | null;
};

export function SelectUserSoundModal({
  isOpen,
  onClose,
  onSelectSound,
  currentSound,
}: SelectUserSoundModalProps) {
  const [sounds, setSounds] = useState<Sound[]>([]);
  const [selectedSound, setSelectedSound] = useState<string | null>(currentSound);

  useEffect(() => {
    if (isOpen) {
      fetchSounds();
      setSelectedSound(currentSound);
    }
  }, [isOpen, currentSound]);

  async function fetchSounds() {
    try {
      const response = await fetch('/api/user-sounds');
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
    const audio = new Audio(`/sounds/users/${sound.name}${sound.extension}`);
    audio.play();
  };

  const handleSave = () => {
    onSelectSound(selectedSound);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='bg-white border-none shadow-lg max-h-[80vh] flex flex-col'>
        <DialogHeader className='flex-shrink-0'>
          <DialogTitle>Select a Sound</DialogTitle>
        </DialogHeader>
        <div className='flex-grow overflow-y-auto space-y-2'>
          <Button
            variant={selectedSound === null ? 'default' : 'outline'}
            className='w-full justify-between'
            onClick={() => setSelectedSound(null)}
          >
            No Sound
          </Button>
          {sounds.map((sound) => (
            <Button
              key={sound.name}
              variant={selectedSound === sound.name ? 'default' : 'outline'}
              className='w-full justify-between'
              onClick={() => setSelectedSound(sound.name)}
            >
              {sound.name.toUpperCase()}
              <Button
                size='sm'
                variant='ghost'
                onClick={(e) => {
                  e.stopPropagation();
                  playSound(sound);
                }}
              >
                <Play className='h-4 w-4' />
              </Button>
            </Button>
          ))}
        </div>
        <DialogFooter className='flex-shrink-0'>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
