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
import { Task } from '@/app/types/task';
import { IconComponent } from './icon-component';
import { SelectIconModal } from './select-icon-modal';
import { SelectSoundModal } from './select-sound-modal';
import { Save, X, Play } from 'lucide-react';

type AddTaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (newTask: Omit<Task, 'taskId' | 'createdAt'>) => void;
};

const defaultTaskState = {
  title: '',
  description: '',
  icon: 'box', // Ensure this is set to 'box'
  sound: null as string | null,
  payoutValue: '0.00',
  activeStatus: true,
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
      iconName: taskState.icon,
      soundUrl: taskState.sound,
      payoutValue: parseFloat(taskState.payoutValue),
      isActive: taskState.activeStatus,
      updatedAt: new Date(),
    });
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={taskState.title}
                  onChange={(e) => setTaskState((prev) => ({ ...prev, title: e.target.value }))}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">Recommend using 3 or fewer words</p>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={taskState.description}
                  onChange={(e) =>
                    setTaskState((prev) => ({ ...prev, description: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label>Task Icon</Label>
                <div className="flex items-center space-x-2">
                  <div className="w-12 h-12 flex items-center justify-center border rounded">
                    <IconComponent icon={taskState.icon} className="h-6 w-6" />
                  </div>
                  <Button type="button" variant="outline" onClick={() => setIsIconModalOpen(true)}>
                    Select Icon
                  </Button>
                </div>
              </div>
              <div>
                <Label>Task Sound</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    value={taskState.sound ? taskState.sound.toUpperCase() : 'NO SOUND'}
                    readOnly
                    placeholder="No sound selected"
                  />
                  <Button type="button" variant="outline" onClick={() => setIsSoundModalOpen(true)}>
                    Select Sound
                  </Button>
                  {taskState.sound && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const audio = new Audio(`/sounds/tasks/${taskState.sound}.mp3`);
                        audio.play();
                      }}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="payoutValue">Payout Value</Label>
                <Input
                  id="payoutValue"
                  type="number"
                  value={taskState.payoutValue}
                  onChange={(e) =>
                    setTaskState((prev) => ({ ...prev, payoutValue: e.target.value }))
                  }
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={taskState.activeStatus}
                  onCheckedChange={(checked) =>
                    setTaskState((prev) => ({ ...prev, activeStatus: checked }))
                  }
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
              <Button type="submit">
                <Save className="h-4 w-4" />
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <SelectIconModal
        isOpen={isIconModalOpen}
        onClose={() => setIsIconModalOpen(false)}
        onSelectIcon={(selectedIcon) => setTaskState((prev) => ({ ...prev, icon: selectedIcon }))}
      />
      <SelectSoundModal
        isOpen={isSoundModalOpen}
        onClose={() => setIsSoundModalOpen(false)}
        onSelectSound={(selectedSound) =>
          setTaskState((prev) => ({ ...prev, sound: selectedSound }))
        }
        currentSound={taskState.sound}
      />
    </>
  );
}
