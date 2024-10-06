import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { IconComponent } from './icon-component';
import { Camera } from 'lucide-react'; // Import the Camera icon

interface AddFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFunds: (amount: number, comments: string, photo: string | null) => void;
  userName: string;
  userIcon: string;
}

export function AddFundsModal({
  isOpen,
  onClose,
  onAddFunds,
  userName,
  userIcon,
}: AddFundsModalProps) {
  const [amount, setAmount] = useState('');
  const [comments, setComments] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!isNaN(numAmount) && numAmount > 0) {
      onAddFunds(numAmount, comments, photo);
      setAmount('');
      setComments('');
      setPhoto(null);
      onClose();
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center">
            Add Funds for {userName} <IconComponent icon={userIcon} className="ml-2 h-6 w-6" />
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                step="0.01"
                min="0"
                required
              />
            </div>
            <div>
              <Label htmlFor="comments">Comments</Label>
              <Textarea
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Add any comments..."
              />
            </div>
            <div>
              <Label htmlFor="photo">Attach Photo</Label>
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={triggerFileInput}
                  className="w-full"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  {photo ? 'Change Photo' : 'Choose File'}
                </Button>
                {photo && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setPhoto(null)}
                    className="text-red-500"
                  >
                    Remove
                  </Button>
                )}
              </div>
              <Input
                id="photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                ref={fileInputRef}
              />
              {photo && (
                <img
                  src={photo}
                  alt="Attached"
                  className="mt-2 max-w-full h-32 object-cover rounded"
                />
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Funds</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
