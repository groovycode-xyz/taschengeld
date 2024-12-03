import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IconSelectorModal } from './icon-selector-modal';
import { SelectUserSoundModal } from './select-user-sound-modal';
import { User } from '@/app/types/user';
import { Save, X, Play, Trash2 } from 'lucide-react';
import { IconComponent } from './icon-component';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (userId: number) => void;
  user: User;
}

export function EditUserModal({
  isOpen,
  onClose,
  onEditUser,
  onDeleteUser,
  user,
}: EditUserModalProps) {
  console.log('EditUserModal received user:', JSON.stringify(user, null, 2));
  console.log('Raw birthday value:', user.birthday);

  // Get just the YYYY-MM-DD part of any date string
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return dateString.split('T')[0];
  };

  const initialBirthday = formatDate(user.birthday);
  console.log('Formatted birthday value:', initialBirthday);

  const [name, setName] = useState(user.name);
  const [icon, setIcon] = useState(user.icon);
  const [soundurl, setSoundurl] = useState(user.soundurl || '');
  const [birthday, setBirthday] = useState(initialBirthday);
  const [isIconModalOpen, setIsIconModalOpen] = useState(false);
  const [isSoundModalOpen, setIsSoundModalOpen] = useState(false);
  const [birthdayError, setBirthdayError] = useState<string | null>(null);

  useEffect(() => {
    console.log('EditUserModal useEffect triggered');
    console.log('User in useEffect:', JSON.stringify(user, null, 2));
    console.log('Birthday in useEffect:', user.birthday);
    console.log('Formatted birthday:', formatDate(user.birthday));
    
    setName(user.name);
    setIcon(user.icon);
    setSoundurl(user.soundurl || '');
    setBirthday(formatDate(user.birthday));
  }, [user]);

  const validateBirthday = (date: string): string | null => {
    const birthdayDate = new Date(date);
    const today = new Date();
    const maxAge = new Date();
    maxAge.setFullYear(today.getFullYear() - 120); // 120 years old max

    if (isNaN(birthdayDate.getTime())) {
      return 'Invalid date format';
    }
    if (birthdayDate > today) {
      return 'Birthday cannot be in the future';
    }
    if (birthdayDate < maxAge) {
      return 'Birthday seems too far in the past';
    }
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate birthday
    if (!birthday) {
      setBirthdayError('Birthday is required');
      return;
    }

    const error = validateBirthday(birthday);
    if (error) {
      setBirthdayError(error);
      return;
    }

    const updatedUser = {
      ...user,
      name,
      icon,
      soundurl,
      birthday,
    };
    console.log('Submitting updated user:', updatedUser);
    onEditUser(updatedUser);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      onDeleteUser(Number(user.user_id));
      onClose();
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-white border-none shadow-lg sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className='space-y-4'>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='name' className='text-right'>
                  Name
                </Label>
                <Input
                  id='name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className='col-span-3'
                />
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
                    onChange={(e) => {
                      console.log('Birthday input changed to:', e.target.value);
                      setBirthday(e.target.value);
                    }}
                    className={birthdayError ? 'border-red-500' : ''}
                    required
                    max={new Date().toISOString().split('T')[0]}
                  />
                  {birthdayError && (
                    <div className='text-red-500 text-sm mt-1'>{birthdayError}</div>
                  )}
                </div>
              </div>

              <div>
                <Label>User Sound</Label>
                <div className='flex items-center space-x-2'>
                  <Input
                    value={
                      soundurl
                        ? soundurl.split('/').pop()?.replace('.mp3', '').toUpperCase()
                        : 'NO SOUND'
                    }
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
                  {soundurl && (
                    <Button
                      type='button'
                      variant='outline'
                      onClick={async () => {
                        try {
                          // Try mp3 first
                          let audio = new Audio(`/sounds/users/${soundurl}.mp3`);
                          await audio.play().catch(() => {
                            // If mp3 fails, try wav
                            audio = new Audio(`/sounds/users/${soundurl}.wav`);
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
                  <IconComponent icon={icon} />
                </Button>
              </div>
            </div>
            <DialogFooter className='mt-6'>
              <Button
                type='button'
                variant='outline'
                onClick={handleDelete}
                className='border-red-500 hover:bg-red-50'
                aria-label='Delete User'
              >
                <Trash2 className='h-4 w-4' />
              </Button>
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
                aria-label='Save Changes'
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
        onSelect={(selectedIcon) => {
          setIcon(selectedIcon);
          setIsIconModalOpen(false);
        }}
      />
      <SelectUserSoundModal
        isOpen={isSoundModalOpen}
        onClose={() => setIsSoundModalOpen(false)}
        onSelect={(selectedSound) => {
          setSoundurl(selectedSound);
          setIsSoundModalOpen(false);
        }}
      />
    </>
  );
}
