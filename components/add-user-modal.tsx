import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IconSelectorModal } from './icon-selector-modal';
import { Baby, Laugh, Smile, Star, Heart, Flower, User, Users, Bird, Bug, Cat, Dog, Egg, Rabbit, Snail, Squirrel, Turtle, Save, X, Play } from 'lucide-react';
import { SelectUserSoundModal } from './select-user-sound-modal';

type User = {
  id: string;
  name: string;
  icon: string;
  sound: string | null;
  birthday: string;
  role: 'parent' | 'child';
};

type AddUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddUser: (user: Omit<User, 'id'>) => void;
};

const defaultUserState = {
  name: '',
  icon: 'user',
  sound: null as string | null,
  birthday: '',
  role: 'child' as 'parent' | 'child',
};

export function AddUserModal({ isOpen, onClose, onAddUser }: AddUserModalProps) {
  const [userState, setUserState] = useState(defaultUserState);
  const [isIconModalOpen, setIsIconModalOpen] = useState(false);
  const [isSoundModalOpen, setIsSoundModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setUserState(defaultUserState);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddUser(userState);
    onClose();
  };

  const getIconComponent = (iconName: string) => {
    const IconComponent = {
      baby: Baby, laugh: Laugh, smile: Smile, star: Star, heart: Heart, flower: Flower, user: User, users: Users,
      bird: Bird, bug: Bug, cat: Cat, dog: Dog, egg: Egg, rabbit: Rabbit, snail: Snail, squirrel: Squirrel, turtle: Turtle
    }[iconName] || User;
    return <IconComponent className="h-6 w-6" />;
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={userState.name}
                  onChange={(e) => setUserState(prev => ({ ...prev, name: e.target.value }))}
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
                  value={userState.birthday}
                  onChange={(e) => setUserState(prev => ({ ...prev, birthday: e.target.value }))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <Select onValueChange={(value: 'parent' | 'child') => setUserState(prev => ({ ...prev, role: value }))} value={userState.role} required>
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
                    value={userState.sound ? userState.sound.toUpperCase() : 'NO SOUND'}
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
                  {userState.sound && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const audio = new Audio(`/sounds/users/${userState.sound}.mp3`);
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
                  {getIconComponent(userState.icon)}
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
        onSelectIcon={(selectedIcon) => setUserState(prev => ({ ...prev, icon: selectedIcon }))}
      />
      <SelectUserSoundModal
        isOpen={isSoundModalOpen}
        onClose={() => setIsSoundModalOpen(false)}
        onSelectSound={(selectedSound) => setUserState(prev => ({ ...prev, sound: selectedSound }))}
        currentSound={userState.sound}
      />
    </>
  );
}