import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from 'components/ui/dialog';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { Label } from 'components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { IconSelectorModal } from './icon-selector-modal';
import {
  Baby,
  Laugh,
  Smile,
  Star,
  Heart,
  Flower,
  User as LucideUser,
  Users,
  Bird,
  Bug,
  Cat,
  Dog,
  Egg,
  Rabbit,
  Snail,
  Squirrel,
  Turtle,
  Play,
  Save,
  X,
} from 'lucide-react';
import { SelectUserSoundModal } from './select-user-sound-modal';
import { CreateUserInput, User } from 'app/types/user';
import { DeleteConfirmationDialog } from './delete-confirmation-dialog';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUser: (user: CreateUserInput) => Promise<Response>;
  onDeleteUser: (userId: number) => void;
  user?: User;
  onUserAdded?: () => void;
}

const defaultUserState = {
  name: '',
  icon: 'user',
  soundurl: '',
  birthday: new Date().toISOString().split('T')[0],
};

export function AddUserModal({
  isOpen,
  onClose,
  onAddUser,
  onDeleteUser,
  user,
  onUserAdded,
}: AddUserModalProps) {
  const { addToast } = useToast();
  const [name, setName] = useState(defaultUserState.name);
  const [icon, setIcon] = useState(defaultUserState.icon);
  const [soundUrl, setSoundUrl] = useState(defaultUserState.soundurl);
  const [birthday, setBirthday] = useState(defaultUserState.birthday);
  const [isIconModalOpen, setIsIconModalOpen] = useState(false);
  const [isSoundModalOpen, setIsSoundModalOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [birthdayError, setBirthdayError] = useState<string | null>(null);

  // Reset form when modal opens/closes or when user prop changes
  useEffect(() => {
    if (user) {
      // Edit mode - populate with user data
      setName(user.name);
      setIcon(user.icon || defaultUserState.icon);
      setSoundUrl(user.soundurl || defaultUserState.soundurl);
      setBirthday(typeof user.birthday === 'string' ? user.birthday : user.birthday.toISOString().split('T')[0]);
    } else if (!isOpen) {
      // Reset to defaults when modal closes
      setName(defaultUserState.name);
      setIcon(defaultUserState.icon);
      setSoundUrl(defaultUserState.soundurl);
      setBirthday(defaultUserState.birthday);
      setBirthdayError(null);
    }
  }, [user, isOpen]);

  const resetForm = () => {
    setName(defaultUserState.name);
    setIcon(defaultUserState.icon);
    setSoundUrl(defaultUserState.soundurl);
    setBirthday(new Date().toISOString().split('T')[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthday) return;

    const trimmedName = name.trim();

    try {
      const userData = {
        name: trimmedName,
        icon,
        soundurl: soundUrl || null,
        birthday,
        sound: soundUrl,
      };

      const response = await onAddUser(userData);
      const data = await response.json();
      
      if (!response.ok) {
        addToast({
          variant: 'destructive',
          title: 'Error',
          description: data.error,
        });
        return;
      }

      resetForm();
      onClose();
      if (onUserAdded) {
        onUserAdded();
      }
    } catch (error) {
      console.error('Error creating user:', error);
      addToast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create user. Please try again.',
      });
    }
  };

  const confirmDelete = () => {
    if (user && user.user_id) {
      onDeleteUser(Number(user.user_id));
      setIsDeleteConfirmationOpen(false);
      onClose();
    }
  };

  const getIconComponent = (iconName: string) => {
    const IconComponent =
      {
        baby: Baby,
        laugh: Laugh,
        smile: Smile,
        star: Star,
        heart: Heart,
        flower: Flower,
        user: LucideUser,
        users: Users,
        bird: Bird,
        bug: Bug,
        cat: Cat,
        dog: Dog,
        egg: Egg,
        rabbit: Rabbit,
        snail: Snail,
        squirrel: Squirrel,
        turtle: Turtle,
      }[iconName] || LucideUser;
    return <IconComponent className='h-6 w-6' />;
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-white border-none shadow-lg sm:max-w-[425px]" aria-describedby='add-user-description'>
          <DialogHeader>
            <DialogTitle>{user ? 'Edit User' : 'Add User'}</DialogTitle>
            <DialogDescription id='add-user-description'>
              {user ? 'Update the details of the user.' : 'Fill in the details to add a new user.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className='space-y-4'>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='name' className='text-right'>
                  Name
                </Label>
                <div className='col-span-3'>
                  <Input
                    id='name'
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    className=''
                    required
                  />
                </div>
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='birthday' className='text-right'>
                  Birthday
                </Label>
                <div className='col-span-3'>
                  <Input
                    id='birthday'
                    type='date'
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    className={birthdayError ? 'border-red-500' : ''}
                    required
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
              <div>
                <Label>User Sound</Label>
                <div className='flex items-center space-x-2'>
                  <Input
                    value={soundUrl ? soundUrl.split('.')[0].toUpperCase() : 'NO SOUND'}
                    readOnly
                    placeholder='No sound selected'
                  />
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => setIsSoundModalOpen(true)}
                    aria-label='Select Sound'
                  >
                    Select Sound
                  </Button>
                  {soundUrl && (
                    <Button
                      type='button'
                      variant='outline'
                      onClick={async () => {
                        try {
                          // Try mp3 first
                          let audio = new Audio(`/sounds/users/${soundUrl}.mp3`);
                          await audio.play().catch(() => {
                            // If mp3 fails, try wav
                            audio = new Audio(`/sounds/users/${soundUrl}.wav`);
                            return audio.play();
                          });
                        } catch (error) {
                          console.error('Error playing sound:', error);
                        }
                      }}
                      aria-label='Play Sound'
                    >
                      <Play className='h-4 w-4' />
                    </Button>
                  )}
                </div>
              </div>
              <div className='flex justify-center'>
                <Button
                  type='button'
                  variant='outline'
                  className='p-2 h-16 w-16 flex justify-center items-center'
                  onClick={() => setIsIconModalOpen(true)}
                  aria-label='Select Icon'
                >
                  {getIconComponent(icon || 'user')} {/* Ensure icon is never empty */}
                </Button>
              </div>
            </div>
            <DialogFooter className='mt-6'>
              <Button 
                type='button' 
                variant='outline' 
                onClick={onClose} 
                aria-label='Cancel'
              >
                <X className='h-4 w-4' />
              </Button>
              <Button 
                type='submit' 
                variant='outline'
                className='border-green-500 hover:bg-green-50'
                aria-label='Save User'
              >
                <Save className='h-4 w-4' />
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <IconSelectorModal
        isOpen={isIconModalOpen}
        onClose={() => setIsIconModalOpen(false)}
        onSelectIcon={(selectedIcon) => setIcon(selectedIcon)}
      />
      <SelectUserSoundModal
        isOpen={isSoundModalOpen}
        onClose={() => setIsSoundModalOpen(false)}
        onSelectSound={(selectedSound) => setSoundUrl(selectedSound || '')}
        currentSound={soundUrl}
      />
      <DeleteConfirmationDialog
        isOpen={isDeleteConfirmationOpen}
        onClose={() => setIsDeleteConfirmationOpen(false)}
        onConfirm={confirmDelete}
        itemName={name}
      />
    </>
  );
}
