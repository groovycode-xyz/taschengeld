import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { IconComponent } from './icon-component';
import { SelectIconModal } from './select-icon-modal';
import { SelectSoundModal } from './select-sound-modal';
import { Save, X, Play } from 'lucide-react';

type AddTaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (newTask: {
    title: string;
    description: string;
    icon_name: string;
    sound_url: string | null;
    payout_value: number;
    is_active: boolean;
  }) => void;
};

const defaultTaskState = {
  title: '',
  description: '',
  icon_name: 'box',
  sound_url: null as string | null,
  payout_value: '0.00',
  is_active: true,
};

export function AddTaskModal({ isOpen, onClose, onAddTask }: AddTaskModalProps) {
  const [taskState, setTaskState] = useState(defaultTaskState);
  const [isIconModalOpen, setIsIconModalOpen] = useState(false);
  const [isSoundModalOpen, setIsSoundModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTaskState(defaultTaskState);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTask({
      title: taskState.title,
      description: taskState.description,
      icon_name: taskState.icon_name,
      sound_url: taskState.sound_url,
      payout_value: parseFloat(taskState.payout_value),
      is_active: taskState.is_active,
    });
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='bg-white border-none shadow-lg max-h-[80vh] flex flex-col'>
          <DialogHeader className='flex-shrink-0'>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className='space-y-4'>
              <div>
                <Label htmlFor='title'>Title</Label>
                <Input
                  id='title'
                  value={taskState.title}
                  onChange={(e) => setTaskState((prev) => ({ ...prev, title: e.target.value }))}
                  required
                />
                <p className='text-sm text-gray-500 mt-1'>Recommend using 3 or fewer words</p>
              </div>
              <div>
                <Label htmlFor='description'>Description</Label>
                <Textarea
                  id='description'
                  value={taskState.description}
                  onChange={(e) =>
                    setTaskState((prev) => ({ ...prev, description: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label>Task Icon</Label>
                <div className='flex items-center space-x-2'>
                  <div className='w-12 h-12 flex items-center justify-center border rounded'>
                    <IconComponent icon={taskState.icon_name} className='h-6 w-6' />
                  </div>
                  <Button type='button' variant='outline' onClick={() => setIsIconModalOpen(true)}>
                    Select Icon
                  </Button>
                </div>
              </div>
              <div>
                <Label>Task Sound</Label>
                <div className='flex items-center space-x-2'>
                  <Input
                    value={taskState.sound_url ? taskState.sound_url.toUpperCase() : 'NO SOUND'}
                    readOnly
                    placeholder='No sound selected'
                  />
                  <Button type='button' variant='outline' onClick={() => setIsSoundModalOpen(true)}>
                    Select Sound
                  </Button>
                  {taskState.sound_url && (
                    <Button
                      type='button'
                      variant='outline'
                      onClick={async () => {
                        try {
                          // Try mp3 first
                          let audio = new Audio(`/sounds/tasks/${taskState.sound_url}.mp3`);
                          await audio.play().catch(() => {
                            // If mp3 fails, try wav
                            audio = new Audio(`/sounds/tasks/${taskState.sound_url}.wav`);
                            return audio.play();
                          });
                        } catch (error) {
                          console.error('Error playing sound:', error);
                        }
                      }}
                    >
                      <Play className='h-4 w-4' />
                    </Button>
                  )}
                </div>
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='payout_value' className='text-right'>
                  Payout Value
                </Label>
                <Input
                  id='payout_value'
                  type='number'
                  step='0.01'
                  value={taskState.payout_value}
                  onChange={(e) =>
                    setTaskState((prev) => ({ ...prev, payout_value: e.target.value }))
                  }
                  className='col-span-3'
                />
              </div>
              <div className='flex items-center space-x-2'>
                <Label htmlFor='is_active' className='text-base'>Active</Label>
                <Switch
                  id='is_active'
                  checked={taskState.is_active}
                  onCheckedChange={(checked) => setTaskState((prev) => ({ ...prev, is_active: checked }))}
                />
              </div>
              <div className='flex justify-end space-x-2 mt-4'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={onClose}
                  className='border-2 border-gray-300 hover:bg-gray-50'
                >
                  <X className='h-4 w-4' />
                </Button>
                <Button
                  type='submit'
                  variant='outline'
                  className='border-2 border-green-500 hover:bg-green-50 text-green-500 hover:text-green-600'
                >
                  <Save className='h-4 w-4' />
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <SelectIconModal
        isOpen={isIconModalOpen}
        onClose={() => setIsIconModalOpen(false)}
        onSelectIcon={(selectedIcon) =>
          setTaskState((prev) => ({ ...prev, icon_name: selectedIcon }))
        }
      />
      <SelectSoundModal
        isOpen={isSoundModalOpen}
        onClose={() => setIsSoundModalOpen(false)}
        onSelectSound={(selectedSound) =>
          setTaskState((prev) => ({ ...prev, sound_url: selectedSound }))
        }
        currentSound={taskState.sound_url}
      />
    </>
  );
}
