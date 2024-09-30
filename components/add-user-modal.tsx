import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IconSelectorModal } from './icon-selector-modal';
import { Baby, Laugh, Smile, Star, Heart, Flower, User, Users, Bird, Bug, Cat, Dog, Egg, Rabbit, Snail, Squirrel, Turtle, Save, X } from 'lucide-react';

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

export function AddUserModal({ isOpen, onClose, onAddUser }: AddUserModalProps) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('user'); // Default icon
  const [sound, setSound] = useState<string | null>(null); // Default sound, can be null
  const [birthday, setBirthday] = useState('');
  const [role, setRole] = useState<'parent' | 'child'>('child');
  const [isIconSelectorOpen, setIsIconSelectorOpen] = useState(false);

  // Reset fields when modal opens
  useEffect(() => {
    if (isOpen) {
      setName('');
      setIcon('user');
      setSound(null);
      setBirthday('');
      setRole('child');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddUser({ name, icon, sound, birthday, role });
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
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
              <Select onValueChange={(value: 'parent' | 'child') => setRole(value)} value={role} required>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="parent">Parent</SelectItem>
                  <SelectItem value="child">Child</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sound" className="text-right">
                Sound
              </Label>
              <Select onValueChange={(value) => setSound(value === 'none' ? null : value)} defaultValue={sound || 'none'}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a sound" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Sound</SelectItem>
                  <SelectItem value="chime">Chime</SelectItem>
                  <SelectItem value="bell">Bell</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-center">
              <Button
                type="button"
                variant="outline"
                className="p-2 h-16 w-16 flex justify-center items-center"
                onClick={() => setIsIconSelectorOpen(true)}
              >
                {getIconComponent(icon)}
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4" />
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
      <IconSelectorModal
        isOpen={isIconSelectorOpen}
        onClose={() => setIsIconSelectorOpen(false)}
        onSelectIcon={setIcon}
      />
    </Dialog>
  );
}