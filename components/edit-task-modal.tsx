import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Task } from '@/app/types/task';

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditTask: (taskId: string, updatedTask: Partial<Task>) => void;
  task: Task | null;
}

export function EditTaskModal({ isOpen, onClose, onEditTask, task }: EditTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [soundUrl, setSoundUrl] = useState('');
  const [payoutValue, setPayoutValue] = useState(0);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setIconUrl(task.iconUrl);
      setSoundUrl(task.soundUrl);
      setPayoutValue(task.payoutValue);
      setIsActive(task.isActive);
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task) {
      onEditTask(task.id, {
        title,
        description,
        iconUrl,
        soundUrl,
        payoutValue,
        isActive,
      });
    }
    onClose();
  };

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit Task</h2>
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mb-2"
            required
          />
          <Input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mb-2"
          />
          <Input
            type="text"
            placeholder="Icon URL"
            value={iconUrl}
            onChange={(e) => setIconUrl(e.target.value)}
            className="mb-2"
          />
          <Input
            type="text"
            placeholder="Sound URL"
            value={soundUrl}
            onChange={(e) => setSoundUrl(e.target.value)}
            className="mb-2"
          />
          <Input
            type="number"
            placeholder="Payout Value"
            value={payoutValue}
            onChange={(e) => setPayoutValue(Number(e.target.value))}
            className="mb-2"
            required
          />
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="mr-2"
            />
            <label>Active</label>
          </div>
          <div className="flex justify-end">
            <Button type="button" onClick={onClose} className="mr-2">Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  );
}