import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { SelectIconModal } from './select-icon-modal';
import { IconComponent } from './icon-component';
import { Target, User as UserIcon } from 'lucide-react';
import { SavingsGoal } from '@/app/types/savingsGoal';
import { User } from '@/app/types/user';

interface CreateEditGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goalData: any) => Promise<void>;
  users: User[];
  mode: 'create' | 'edit';
  existingGoal?: SavingsGoal;
}

export function CreateEditGoalModal({
  isOpen,
  onClose,
  onSave,
  users,
  mode,
  existingGoal,
}: CreateEditGoalModalProps) {
  const { addToast } = useToast();
  const [userId, setUserId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState('target');
  const [targetAmount, setTargetAmount] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isIconModalOpen, setIsIconModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultState = React.useMemo(
    () => ({
      userId: '',
      title: '',
      description: '',
      iconName: 'target',
      targetAmount: '',
      isActive: true,
    }),
    []
  );

  useEffect(() => {
    if (existingGoal && mode === 'edit') {
      setUserId(existingGoal.user_id.toString());
      setTitle(existingGoal.title);
      setDescription(existingGoal.description || '');
      setIconName(existingGoal.icon_name);
      setTargetAmount(existingGoal.target_amount);
      setIsActive(existingGoal.is_active);
    } else if (!isOpen) {
      // Reset to defaults when modal closes
      setUserId(defaultState.userId);
      setTitle(defaultState.title);
      setDescription(defaultState.description);
      setIconName(defaultState.iconName);
      setTargetAmount(defaultState.targetAmount);
      setIsActive(defaultState.isActive);
    }
  }, [isOpen, existingGoal, mode, defaultState]);

  const resetForm = () => {
    setUserId(defaultState.userId);
    setTitle(defaultState.title);
    setDescription(defaultState.description);
    setIconName(defaultState.iconName);
    setTargetAmount(defaultState.targetAmount);
    setIsActive(defaultState.isActive);
  };

  const validateForm = () => {
    if (!title.trim()) {
      addToast({
        title: 'Validation Error',
        description: 'Goal title is required',
        variant: 'destructive',
      });
      return false;
    }

    if (mode === 'create' && !userId) {
      addToast({
        title: 'Validation Error',
        description: 'Please select a user for this goal',
        variant: 'destructive',
      });
      return false;
    }

    const amount = parseFloat(targetAmount);
    if (isNaN(amount) || amount <= 0) {
      addToast({
        title: 'Validation Error',
        description: 'Target amount must be a positive number',
        variant: 'destructive',
      });
      return false;
    }

    if (amount > 10000) {
      addToast({
        title: 'Validation Error',
        description: 'Target amount cannot exceed 10,000',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const goalData: any = {
        title: title.trim(),
        description: description.trim() || undefined,
        icon_name: iconName,
        target_amount: parseFloat(targetAmount),
      };

      if (mode === 'create') {
        goalData.user_id = parseInt(userId, 10);
      } else {
        goalData.is_active = isActive;
      }

      await onSave(goalData);

      addToast({
        title: 'Success',
        description: `Goal ${mode === 'create' ? 'created' : 'updated'} successfully!`,
      });

      resetForm();
      onClose();
    } catch (error) {
      addToast({
        title: 'Error',
        description: `Failed to ${mode} savings goal. Please try again.`,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const selectedUser = users.find((user) => user.user_id.toString() === userId);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <Target className='h-5 w-5' />
              {mode === 'create' ? 'Create New Goal' : 'Edit Goal'}
            </DialogTitle>
            <DialogDescription>
              {mode === 'create'
                ? 'Set up a new savings goal for a family member.'
                : 'Update the goal details and settings.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className='space-y-4'>
            {/* User Selection (only for create mode) */}
            {mode === 'create' && (
              <div className='space-y-2'>
                <Label htmlFor='user'>Family Member</Label>
                <Select value={userId} onValueChange={setUserId}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select family member' />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.user_id} value={user.user_id.toString()}>
                        <div className='flex items-center gap-2'>
                          <IconComponent icon={user.icon} className='h-4 w-4' />
                          {user.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Goal Title */}
            <div className='space-y-2'>
              <Label htmlFor='title'>Goal Title</Label>
              <Input
                id='title'
                placeholder='e.g., New Bicycle, Video Game, Trip'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
                required
              />
            </div>

            {/* Goal Description */}
            <div className='space-y-2'>
              <Label htmlFor='description'>Description (optional)</Label>
              <Textarea
                id='description'
                placeholder='Add details about your goal...'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            {/* Icon Selection */}
            <div className='space-y-2'>
              <Label>Goal Icon</Label>
              <Button
                type='button'
                variant='outline'
                onClick={() => setIsIconModalOpen(true)}
                className='w-full justify-start gap-2'
              >
                <IconComponent icon={iconName} className='h-5 w-5' />
                Choose Icon
              </Button>
            </div>

            {/* Target Amount */}
            <div className='space-y-2'>
              <Label htmlFor='targetAmount'>Target Amount</Label>
              <Input
                id='targetAmount'
                type='number'
                step='0.01'
                min='0.01'
                max='10000'
                placeholder='0.00'
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                required
              />
            </div>

            {/* Active Status (only for edit mode) */}
            {mode === 'edit' && (
              <div className='flex items-center justify-between'>
                <div className='space-y-0.5'>
                  <Label>Goal Status</Label>
                  <div className='text-sm text-muted-foreground'>
                    Inactive goals cannot receive contributions
                  </div>
                </div>
                <Switch checked={isActive} onCheckedChange={setIsActive} />
              </div>
            )}

            <DialogFooter className='flex gap-2 sm:gap-0'>
              <Button type='button' variant='outline' onClick={handleClose}>
                Cancel
              </Button>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting
                  ? mode === 'create'
                    ? 'Creating...'
                    : 'Updating...'
                  : mode === 'create'
                    ? 'Create Goal'
                    : 'Update Goal'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Icon Selector Modal */}
      <SelectIconModal
        isOpen={isIconModalOpen}
        onClose={() => setIsIconModalOpen(false)}
        onSelectIcon={setIconName}
        currentIcon={iconName}
      />
    </>
  );
}
