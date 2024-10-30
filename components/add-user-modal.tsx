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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'components/ui/select';
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
  Trash2,
} from 'lucide-react';
import { SelectUserSoundModal } from './select-user-sound-modal';
import { CreateUserInput, User } from 'app/types/user';
import { DeleteConfirmationDialog } from './delete-confirmation-dialog';
import { format } from 'date-fns';

// Add validation function
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

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUser: (user: CreateUserInput | User) => void;
  onDeleteUser: (userId: number) => void;
  user?: User;
}

const defaultUserState = {
  name: '',
  icon: 'user',
  soundurl: '',
  birthday: '',
  role: 'child' as const,
};

export function AddUserModal({
  isOpen,
  onClose,
  onAddUser,
  onDeleteUser,
  user,
}: AddUserModalProps) {
  const [name, setName] = useState(defaultUserState.name);
  const [icon, setIcon] = useState(defaultUserState.icon);
  const [soundUrl, setSoundUrl] = useState(defaultUserState.soundurl);
  const [birthday, setBirthday] = useState(defaultUserState.birthday);
  const [role, setRole] = useState(defaultUserState.role);
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
      setBirthday(format(new Date(user.birthday), 'yyyy-MM-dd'));
      setRole(user.role);
    } else if (!isOpen) {
      // Reset to defaults when modal closes
      setName(defaultUserState.name);
      setIcon(defaultUserState.icon);
      setSoundUrl(defaultUserState.soundurl);
      setBirthday(defaultUserState.birthday);
      setRole(defaultUserState.role);
      setBirthdayError(null);
    }
  }, [user, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate birthday
    if (!birthday) {
      setBirthdayError('Birthday is required');
      return;
    }

    const formattedBirthday = new Date(birthday).toISOString();
    const userData: CreateUserInput = {
      name,
      icon: icon || 'user',
      soundurl: soundUrl,
      birthday: formattedBirthday, // Will always have a value
      role,
    };
    if (user) {
      onAddUser({ ...userData, user_id: user.user_id });
    } else {
      onAddUser(userData);
    }
    onClose();
  };

  const handleDelete = () => {
    setIsDeleteConfirmationOpen(true);
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
    return <IconComponent className="h-6 w-6" />;
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent aria-describedby="add-user-description">
          <DialogHeader>
            <DialogTitle>{user ? 'Edit User' : 'Add User'}</DialogTitle>
            <DialogDescription id="add-user-description">
              {user ? 'Update the details of the user.' : 'Fill in the details to add a new user.'}
            </DialogDescription>
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
                <Select
                  onValueChange={(value: 'parent' | 'child') => setRole(value)}
                  value={role}
                  required
                >
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
                    value={soundUrl ? soundUrl.split('.')[0].toUpperCase() : 'NO SOUND'}
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
                  {soundUrl && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const audio = new Audio(`/sounds/users/${soundUrl}`);
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
                  {getIconComponent(icon || 'user')} {/* Ensure icon is never empty */}
                </Button>
              </div>
            </div>
            <DialogFooter className="mt-6">
              {user && (
                <Button type="button" variant="destructive" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete User
                </Button>
              )}
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
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
