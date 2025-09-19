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
import { SoundSelectorModal } from './sound-selector-modal';
import { CreateUserInput, User } from 'app/types/user';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUser: (user: CreateUserInput) => Promise<Response>;
  user?: User;
  onUserAdded?: () => void;
}

export function AddUserModal({ isOpen, onClose, onAddUser, user, onUserAdded }: AddUserModalProps) {
  const { addToast } = useToast();
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('default');
  const [soundUrl, setSoundUrl] = useState<string | null>(null);
  const [birthday, setBirthday] = useState(new Date().toISOString().split('T')[0]);
  const [isIconModalOpen, setIsIconModalOpen] = useState(false);
  const [isSoundModalOpen, setIsSoundModalOpen] = useState(false);

  const defaultUserState = React.useMemo(
    () => ({
      name: '',
      icon: 'default',
      sound_url: null,
      birthday: new Date().toISOString().split('T')[0],
    }),
    []
  );

  useEffect(() => {
    if (user) {
      setName(user.name);
      setIcon(user.icon || defaultUserState.icon);
      setSoundUrl(user.sound_url);
      setBirthday(user.birthday);
    } else if (!isOpen) {
      // Reset to defaults when modal closes
      setName(defaultUserState.name);
      setIcon(defaultUserState.icon);
      setSoundUrl(defaultUserState.sound_url);
      setBirthday(defaultUserState.birthday);
    }
  }, [isOpen, user, defaultUserState]);

  const resetForm = () => {
    setName(defaultUserState.name);
    setIcon(defaultUserState.icon);
    setSoundUrl(defaultUserState.sound_url);
    setBirthday(new Date().toISOString().split('T')[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const userData = {
        name,
        icon,
        sound_url: soundUrl,
        birthday,
      };

      const response = await onAddUser(userData);

      if (!response.ok) {
        const data = await response.json();
        addToast({
          variant: 'destructive',
          title: 'Error',
          description: data.error || 'Failed to create user',
        });
        return;
      }

      resetForm();
      onClose();
      if (onUserAdded) {
        onUserAdded();
      }
    } catch (error) {
      addToast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create user. Please try again.',
      });
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

  const handleSoundSelect = (selectedSound: string | null) => {
    setSoundUrl(selectedSound);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          className='border-none shadow-lg sm:max-w-[425px]'
          aria-describedby='add-user-description'
        >
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
                    className=''
                    required
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
              <div>
                <Label>User Sound</Label>
                <div className='flex items-center space-x-2'>
                  <Button
                    type='button'
                    variant='outline'
                    className='flex-1'
                    onClick={() => setIsSoundModalOpen(true)}
                    aria-label='Select Sound'
                  >
                    {soundUrl ? soundUrl.toUpperCase() : 'Select Sound'}
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
                          // Error playing sound
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
              <Button type='button' variant='outline' onClick={onClose} aria-label='Cancel'>
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
      <SoundSelectorModal
        isOpen={isSoundModalOpen}
        onClose={() => setIsSoundModalOpen(false)}
        onSelect={handleSoundSelect}
        currentSound={soundUrl}
        type='user'
      />
    </>
  );
}
