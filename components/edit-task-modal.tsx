import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Task } from '@/app/types/task';
import { IconSelector } from './icon-selector';

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditTask: (taskId: string, updatedTask: Partial<Task>) => void;
  task: Task | null;
}

export function EditTaskModal({ isOpen, onClose, onEditTask, task }: EditTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState('beaker');
  const [soundUrl, setSoundUrl] = useState('');
  const [payoutValue, setPayoutValue] = useState('0.00');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setIconName(task.iconName);
      setSoundUrl(task.soundUrl);
      setPayoutValue(task.payoutValue.toString());
      setIsActive(task.isActive);
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task) {
      onEditTask(task.id, {
        title,
        description,
        iconName,
        soundUrl,
        payoutValue: parseFloat(payoutValue),
        isActive,
      });
    }
    onClose();
  };

  if (!isOpen || !task) return null;

  return (
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
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="iconName">Task Icon</Label>
              <IconSelector selectedIcon={iconName} onSelectIcon={setIconName} />
            </div>
            <div>
              <Label htmlFor="soundUrl">Sound URL</Label>
              <Input
                id="soundUrl"
                value={soundUrl}
                onChange={(e) => setSoundUrl(e.target.value)}
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
                checked={isActive}
                onCheckedChange={setIsActive}
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
  );
}