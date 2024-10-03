import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Task } from '@/app/types/task';
import { IconComponent } from './icon-component';
import { SelectIconModal } from './select-icon-modal';

type EditTaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onEditTask: (taskId: number, updatedTask: Partial<Task>) => void;
  task: Task | null;
};

export function EditTaskModal({ isOpen, onClose, onEditTask, task }: EditTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('');
  const [sound, setSound] = useState<string | null>('');
  const [payoutValue, setPayoutValue] = useState('0.00');
  const [activeStatus, setActiveStatus] = useState(true);
  const [isIconModalOpen, setIsIconModalOpen] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setIcon(task.icon);
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
                <Label htmlFor="soundUrl">Sound URL</Label>
                <Input
                  id="soundUrl"
                  value={sound || ''}
                  onChange={(e) => setSound(e.target.value)}
                />
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
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <SelectIconModal
        isOpen={isIconModalOpen}
        onClose={() => setIsIconModalOpen(false)}
        onSelectIcon={(selectedIcon) => setIcon(selectedIcon)}
      />
    </>
  );
}