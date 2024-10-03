import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from '@/app/types/user';
import { IconSelectorModal } from './icon-selector-modal';
import { SelectUserSoundModal } from './select-user-sound-modal';
import { Baby, Laugh, Smile, Star, Heart, Flower, User as UserIcon, Users, Bird, Bug, Cat, Dog, Egg, Rabbit, Snail, Squirrel, Turtle, Save, X, Play } from 'lucide-react';

type EditUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onEditUser: (userId: string, updatedUser: Partial<User>) => void;
  user: User | null;
};

export function EditUserModal({ isOpen, onClose, onEditUser, user }: EditUserModalProps) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('user');
  const [sound, setSound] = useState<string | null>(null);
  const [birthday, setBirthday] = useState('');
  const [role, setRole] = useState<'parent' | 'child'>('child');
  const [isIconModalOpen, setIsIconModalOpen] = useState(false);
  const [isSoundModalOpen, setIsSoundModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setIcon(user.icon);
      setSound(user.sound);
      setBirthday(user.birthday);
      setRole(user.role);
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      onEditUser(user.id, { name, icon, sound, birthday, role });
    }
    onClose();
  };

  const getIconComponent = (iconName: string) => {
    const IconComponent = {
      baby: Baby, laugh: Laugh, smile: Smile, star: Star, heart: Heart, flower: Flower, user: UserIcon, users: Users,
      bird: Bird, bug: Bug, cat: Cat, dog: Dog, egg: Egg, rabbit: Rabbit, snail: Snail, squirrel: Squirrel, turtle: Turtle
    }[iconName] || UserIcon;
    return <IconComponent className="h-6 w-6" />;
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
                <Input
                  id="birthday"
                  type="date"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  className="col-span-3"
                />
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
                    value={sound ? sound.toUpperCase() : 'NO SOUND'}
                    readOnly
                    placeholder="No sound selected"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsSoundModalOpen(true)}
                  >
                    Select Sound
                  </Button>
                  {sound && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const audio = new Audio(`/sounds/users/${sound}.mp3`);
                        audio.play();
                      }}
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
                >
                  {getIconComponent(icon)}
                </Button>
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
              <Button type="submit">
                <Save className="h-4 w-4" />
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <IconSelectorModal
        isOpen={isIconModalOpen}
        onClose={() => setIsIconModalOpen(false)}
        onSelectIcon={setIcon}
      />
      <SelectUserSoundModal
        isOpen={isSoundModalOpen}
        onClose={() => setIsSoundModalOpen(false)}
        onSelectSound={setSound}
        currentSound={sound}
      />
    </>
  );
}