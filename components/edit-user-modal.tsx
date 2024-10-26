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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

  const [name, setName] = useState(user.name);
  const [icon, setIcon] = useState(user.icon);
  const [soundurl, setSoundurl] = useState(user.soundurl || '');
  const [birthday, setBirthday] = useState(user.birthday ? user.birthday.split('T')[0] : '');
  const [role, setRole] = useState(user.role);
  const [isIconModalOpen, setIsIconModalOpen] = useState(false);
  const [isSoundModalOpen, setIsSoundModalOpen] = useState(false);
  const [birthdayError, setBirthdayError] = useState<string | null>(null);

  useEffect(() => {
    console.log('EditUserModal useEffect triggered with user:', user);
    console.log('Setting birthday:', user.birthday ? user.birthday.split('T')[0] : '');
    console.log('Setting soundurl:', user.soundurl || '');
    setName(user.name);
    setIcon(user.icon);
    setSoundurl(user.soundurl || '');
    setBirthday(user.birthday ? user.birthday.split('T')[0] : '');
    setRole(user.role);
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
      birthday, // Will always have a value
      role,
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="birthday" className="text-right">
                  Birthday
                </Label>
                <div className="col-span-3">
                  <Input
                    id="birthday"
                    type="date"
                    value={birthday}
                    onChange={(e) => {
                      setBirthday(e.target.value);
                      const error = validateBirthday(e.target.value);
                      setBirthdayError(error);
                    }}
                    className={birthdayError ? 'border-red-500' : ''}
                    required
                  />
                  {birthdayError && <p className="text-sm text-red-500 mt-1">{birthdayError}</p>}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <Select onValueChange={(value: 'parent' | 'child') => setRole(value)} value={role}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="child">Child</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>User Sound</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    value={
                      soundurl
                        ? soundurl.split('/').pop()?.replace('.mp3', '').toUpperCase()
                        : 'NO SOUND'
                    }
                    readOnly
                    placeholder="No sound selected"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsSoundModalOpen(true)}
                    aria-label="Select Sound"
                  >
                    Select Sound
                  </Button>
                  {soundurl && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const audio = new Audio(soundurl);
                        audio.play();
                      }}
                      aria-label="Play Sound"
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  className="p-2 h-16 w-16 flex justify-center items-center"
                  onClick={() => setIsIconModalOpen(true)}
                  aria-label="Select Icon"
                >
                  <IconComponent icon={icon} />
                </Button>
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                aria-label="Delete User"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button type="button" variant="outline" onClick={onClose} aria-label="Cancel">
                <X className="h-4 w-4" />
              </Button>
              <Button type="submit" aria-label="Save Changes">
                <Save className="h-4 w-4" />
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
        onSelectSound={(selectedSound) => setSoundurl(selectedSound || '')}
        currentSound={soundurl}
      />
    </>
  );
}
