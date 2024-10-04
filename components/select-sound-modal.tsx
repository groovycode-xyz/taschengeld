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
  const [sounds, setSounds] = useState<string[]>([]);
  const [selectedSound, setSelectedSound] = useState<string | null>(currentSound);

  useEffect(() => {
    if (isOpen) {
      fetchSounds();
      setSelectedSound(currentSound);
    }
  }, [isOpen, currentSound]);

  async function fetchSounds() {
    try {
      const response = await fetch('/api/sounds');
      if (!response.ok) {
        throw new Error('Failed to fetch sounds');
      }
      const data = await response.json();
      setSounds(data);
    } catch (error) {
      console.error('Error fetching sounds:', error);
    }
  }

  const playSound = (sound: string) => {
    const audio = new Audio(`/sounds/tasks/${sound}.mp3`);
    audio.play();
  };

  const handleSave = () => {
    onSelectSound(selectedSound);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select a Sound</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <Button
            variant={selectedSound === null ? 'default' : 'outline'}
            className="w-full justify-between"
            onClick={() => setSelectedSound(null)}
          >
            No Sound
          </Button>
          {sounds.map((sound) => (
            <Button
              key={sound}
              variant={selectedSound === sound ? 'default' : 'outline'}
              className="w-full justify-between"
              onClick={() => setSelectedSound(sound)}
            >
              {sound.toUpperCase()}
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  playSound(sound);
                }}
              >
                <Play className="h-4 w-4" />
              </Button>
            </Button>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
