import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Task } from '@/app/types/task';
import { IconComponent } from './icon-component';
import { SelectIconModal } from './select-icon-modal';
import { DeleteConfirmationModal } from './delete-confirmation-modal';
import { Trash2, Save, X, Play } from 'lucide-react';
import { SelectSoundModal } from './select-sound-modal';

type EditTaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onEditTask: (taskId: number, updatedTask: Partial<Task>) => void;
  onDeleteTask: (taskId: number) => void;
  task: Task | null;
};

export function EditTaskModal({ isOpen, onClose, onEditTask, onDeleteTask, task }: EditTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('box'); // Changed from 'cuboid' to 'box'
  const [sound, setSound] = useState<string | null>('');
  const [payoutValue, setPayoutValue] = useState('0.00');
  const [activeStatus, setActiveStatus] = useState(true);
  const [isIconModalOpen, setIsIconModalOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [isSoundModalOpen, setIsSoundModalOpen] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setIcon(task.icon || 'box'); // Changed from 'cuboid' to 'box'
      setSound(task.sound);
      setPayoutValue(task.payoutValue.toString());
      setActiveStatus(task.activeStatus);
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task) {
      onEditTask(task.taskId, {
        title,
        description,
        icon,
        sound,
        payoutValue: parseFloat(payoutValue),
        activeStatus,
      });
    }
    onClose();
  };

  const handleDelete = () => {
    setIsDeleteConfirmationOpen(true);
  };

  const confirmDelete = () => {
    if (task) {
      onDeleteTask(task.taskId);
      setIsDeleteConfirmationOpen(false);
      onClose();
    }
  };

  if (!isOpen || !task) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">Recommend using 3 or fewer words</p>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div>
                <Label>Task Icon</Label>
                <div className="flex items-center space-x-2">
                  <div className="w-12 h-12 flex items-center justify-center border rounded">
                    <IconComponent icon={icon} className="h-6 w-6" />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsIconModalOpen(true)}
                  >
                    Select Icon
                  </Button>
                </div>
              </div>
              <div>
                <Label>Task Sound</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    value={sound ? sound.toUpperCase() : 'NO SOUND'}
                    readOnly
                    placeholder="No sound selected"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsSoundModalOpen(true)}
                  >
                    Select Sound
                  </Button>
                  {sound && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const audio = new Audio(`/sounds/tasks/${sound}.mp3`);
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
                  value={payoutValue}
                  onChange={(e) => setPayoutValue(e.target.value)}
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={activeStatus}
                  onCheckedChange={setActiveStatus}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </div>
            <div className="mt-6 flex justify-between items-center">
              <Button type="button" variant="destructive" onClick={handleDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
              <div className="space-x-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <SelectIconModal
        isOpen={isIconModalOpen}
        onClose={() => setIsIconModalOpen(false)}
        onSelectIcon={(selectedIcon) => setIcon(selectedIcon)}
      />
      <SelectSoundModal
        isOpen={isSoundModalOpen}
        onClose={() => setIsSoundModalOpen(false)}
        onSelectSound={(selectedSound) => setSound(selectedSound)}
        currentSound={sound}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteConfirmationOpen}
        onClose={() => setIsDeleteConfirmationOpen(false)}
        onConfirmDelete={confirmDelete}
        taskTitle={task.title}
      />
    </>
  );
}