import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { User } from '@/types/user'; // Updated User type import
import { IconSelectorModal } from './icon-selector-modal';
import { SelectUserSoundModal } from './select-user-sound-modal';
import {
  Baby,
  Laugh,
  Smile,
  Star,
  Heart,
  Flower,
  User as UserIcon,
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
  Save,
  X,
  Play,
} from 'lucide-react';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditUser: (user: User) => void;
  user: User;
}

export function EditUserModal({ isOpen, onClose, onEditUser, user }: EditUserModalProps) {
  const [name, setName] = useState(user.name);
  const [icon, setIcon] = useState(user.icon);
  const [sound, setSound] = useState<string | null>(user.sound);
  const [birthday, setBirthday] = useState(user.birthday);
  const [role, setRole] = useState<'parent' | 'child'>(user.role);
  const [isIconModalOpen, setIsIconModalOpen] = useState(false);
  const [isSoundModalOpen, setIsSoundModalOpen] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setIcon(user.icon);
      setSound(user.sound);
      setBirthday(user.birthday);
      setRole(user.role);
      setNameError(null); // Reset error when user changes
    }
  }, [user]);

  /**
   * Handles form submission by validating inputs and invoking the onEditUser callback.
   * @param e - The form submit event.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEditUser({ ...user, name, icon, sound, birthday, role });
    onClose();
    resetForm();
  };

  /**
   * Resets the form state to initial values.
   */
  const resetForm = () => {
    setName('');
    setIcon('user');
    setSound(null);
    setBirthday('');
    setRole('child');
    setNameError(null);
  };

  /**
   * Returns the appropriate icon component based on the icon name.
   * @param iconName - The name of the icon.
   * @returns JSX Element representing the icon.
   */
  const getIconComponent = (iconName: string) => {
    const IconComponent =
      {
        baby: Baby,
        laugh: Laugh,
        smile: Smile,
        star: Star,
        heart: Heart,
        flower: Flower,
        user: UserIcon,
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
      }[iconName] || UserIcon;
    return <IconComponent className="h-6 w-6" />;
  };

  /**
   * Handles playing the selected sound.
   */
  const handlePlaySound = () => {
    if (sound) {
      try {
        const audio = new Audio(`/sounds/users/${sound}.mp3`);
        audio.play();
      } catch (error) {
        console.error('Error playing sound:', error);
        // Optionally, display an error message to the user
      }
    }
  };

  if (!isOpen || !user) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Name Field */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (e.target.value.trim() !== '') {
                      setNameError(null);
                    }
                  }}
                  className="col-span-3"
                  aria-invalid={nameError ? 'true' : 'false'}
                  aria-describedby={nameError ? 'name-error' : undefined}
                />
                {nameError && (
                  <p className="col-span-4 text-red-500 text-sm" id="name-error">
                    {nameError}
                  </p>
                )}
              </div>

              {/* Birthday Field */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="birthday" className="text-right">
                  Birthday
                </Label>
                <Input
                  id="birthday"
                  type="date"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  className="col-span-3"
                  max={new Date().toISOString().split('T')[0]} // Prevent selecting future dates
                />
              </div>

              {/* Role Select */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <Select onValueChange={(value: 'parent' | 'child') => setRole(value)} value={role}>
                  <SelectTrigger className="col-span-3" aria-label="Select role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="child">Child</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* User Sound Selection */}
              <div>
                <Label>User Sound</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    value={sound ? sound.toUpperCase() : 'NO SOUND'}
                    readOnly
                    placeholder="No sound selected"
                    aria-label="Selected sound"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsSoundModalOpen(true)}
                    aria-label="Select Sound"
                  >
                    Select Sound
                  </Button>
                  {sound && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePlaySound}
                      aria-label="Play Sound"
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Icon Selection */}
              <div className="flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  className="p-2 h-16 w-16 flex justify-center items-center"
                  onClick={() => setIsIconModalOpen(true)}
                  aria-label="Select Icon"
                >
                  {getIconComponent(icon)}
                </Button>
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onClose();
                  resetForm();
                }}
                aria-label="Cancel"
              >
                <X className="h-4 w-4" />
              </Button>
              <Button type="submit" aria-label="Save">
                <Save className="h-4 w-4" />
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Icon Selector Modal */}
      <IconSelectorModal
        isOpen={isIconModalOpen}
        onClose={() => setIsIconModalOpen(false)}
        onSelectIcon={(selectedIcon) => {
          setIcon(selectedIcon);
          setIsIconModalOpen(false);
        }}
      />

      {/* Sound Selector Modal */}
      <SelectUserSoundModal
        isOpen={isSoundModalOpen}
        onClose={() => setIsSoundModalOpen(false)}
        onSelectSound={(selectedSound) => {
          setSound(selectedSound);
          setIsSoundModalOpen(false);
        }}
        currentSound={sound}
      />
    </>
  );
}
