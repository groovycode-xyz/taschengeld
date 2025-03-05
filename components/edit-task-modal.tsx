import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Task } from '@/app/types/task';
import { IconComponent } from './icon-component';
import { SelectIconModal } from './select-icon-modal';
import { DeleteConfirmationModal } from './delete-confirmation-modal';
import { Trash2, Save, X, Play } from 'lucide-react';
import { SoundSelectorModal } from './sound-selector-modal';

type EditTaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onEditTask: (taskId: string, updatedTask: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  task: Task | null;
  // Add users to props if you intend to use handleAssignUser
  // users: User[];
};

export function EditTaskModal({
  isOpen,
  onClose,
  onEditTask,
  onDeleteTask,
  task /* users */,
}: EditTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon_name, setIconName] = useState('box');
  const [sound_url, setSoundUrl] = useState<string | null>(null);
  const [payout_value, setPayoutValue] = useState('0.00');
  const [is_active, setIsActive] = useState(true);
  const [isIconModalOpen, setIsIconModalOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [isSoundModalOpen, setIsSoundModalOpen] = useState(false); // Add this line
  // {{ Remove the following line }}
  // const [assignedUser, setAssignedUser] = useState<User | null>(null);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setIconName(task.icon_name || 'box');
      setSoundUrl(task.sound_url);
      setPayoutValue(task.payout_value !== undefined ? task.payout_value.toString() : '0');
      setIsActive(task.is_active);
      // {{ If using assignedUser, set it here }}
      // setAssignedUser(task.assignedUser);
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task && task.task_id) {
      onEditTask(task.task_id, {
        title,
        description,
        icon_name,
        sound_url,
        payout_value: parseFloat(payout_value),
        is_active,
      });
      onClose();
    } else {
      console.error('Cannot update task: task_id is undefined');
    }
  };

  // {{ Remove the handleAssignUser function if it's not used }}
  /*
  const handleAssignUser = (userId: string) => {
    const user = users.find((u: User) => u.id === userId) || null;
    setAssignedUser(user);
    onEditTask(task.taskId, { assignedUserId: userId });
  };
  */

  // Add handleDelete function to open the delete confirmation modal
  const handleDelete = () => {
    setIsDeleteConfirmationOpen(true);
  };

  // Add confirmDelete function to handle the actual deletion
  const confirmDelete = () => {
    if (task && task.task_id) {
      onDeleteTask(task.task_id);
      onClose();
    } else {
      console.error('Cannot delete task: task_id is undefined');
    }
  };

  if (!isOpen || !task) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='sm:max-w-[500px]'>
          <DialogHeader className='flex-shrink-0'>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <form id='editTaskForm' onSubmit={handleSubmit}>
            <div className='space-y-4'>
              <div className='space-y-4'>
                <div>
                  <Label htmlFor='title'>Title</Label>
                  <Input
                    id='title'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                  <p className='text-sm text-gray-500 mt-1'>Recommend using 3 or fewer words</p>
                </div>
                <div>
                  <Label htmlFor='description'>Description</Label>
                  <Textarea
                    id='description'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className='h-20'
                  />
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label>Task Icon</Label>
                  <div className='flex justify-start mt-2'>
                    <Button
                      type='button'
                      variant='outline'
                      className='p-2 h-16 w-16 flex justify-center items-center'
                      onClick={() => setIsIconModalOpen(true)}
                      aria-label='Select Icon'
                    >
                      <IconComponent icon={icon_name} className='h-8 w-8' />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label>Task Sound</Label>
                  <div className='flex items-center space-x-2 mt-2'>
                    <Button
                      type='button'
                      variant='outline'
                      onClick={() => setIsSoundModalOpen(true)}
                      className='flex-1'
                    >
                      {sound_url ? sound_url.toUpperCase() : 'Select Sound'}
                    </Button>
                    {sound_url && (
                      <Button
                        type='button'
                        variant='outline'
                        onClick={async () => {
                          try {
                            // Try mp3 first
                            let audio = new Audio(`/sounds/tasks/${sound_url}.mp3`);
                            await audio.play().catch(() => {
                              // If mp3 fails, try wav
                              audio = new Audio(`/sounds/tasks/${sound_url}.wav`);
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
              </div>

              <div className='grid grid-cols-2 gap-4 items-center'>
                <div>
                  <Label htmlFor='payoutValue'>Payout Value</Label>
                  <Input
                    id='payoutValue'
                    type='number'
                    value={payout_value}
                    onChange={(e) => setPayoutValue(e.target.value)}
                    step='0.01'
                    min='0'
                    required
                  />
                </div>
                <div className='flex items-center space-x-2 pt-6'>
                  <Label htmlFor='is_active' className='text-base'>
                    Active
                  </Label>
                  <Switch id='is_active' checked={is_active} onCheckedChange={setIsActive} />
                </div>
              </div>
            </div>

            <div className='flex justify-end space-x-2 mt-6 pt-4 border-t'>
              <Button
                type='button'
                variant='outline'
                onClick={handleDelete}
                className='border-2 border-red-500 hover:bg-red-50 text-red-500 hover:text-red-600'
              >
                <Trash2 className='h-4 w-4' />
              </Button>
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
          </form>
        </DialogContent>
      </Dialog>
      <SelectIconModal
        isOpen={isIconModalOpen}
        onClose={() => setIsIconModalOpen(false)}
        onSelectIcon={(selectedIcon) => setIconName(selectedIcon)}
        currentIcon={icon_name}
      />
      <SoundSelectorModal
        isOpen={isSoundModalOpen}
        onClose={() => setIsSoundModalOpen(false)}
        onSelect={setSoundUrl}
        currentSound={sound_url}
        type="task"
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
