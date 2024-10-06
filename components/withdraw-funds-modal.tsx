import React, { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';

interface WithdrawFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWithdrawFunds: (amount: number, comments: string, photo: string | null) => void;
  balance: number;
  userName: string;
}

export function WithdrawFundsModal({
  isOpen,
  onClose,
  onWithdrawFunds,
  balance,
  userName,
}: WithdrawFundsModalProps) {
  const [amount, setAmount] = useState('');
  const [comments, setComments] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!isNaN(numAmount) && numAmount > 0 && numAmount <= balance) {
      onWithdrawFunds(numAmount, comments, photo);
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Withdraw Funds for {userName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="amount">Amount (Max: ${balance.toFixed(2)})</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                step="0.01"
                min="0"
                max={balance}
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
              <Input id="photo" type="file" accept="image/*" onChange={handlePhotoUpload} />
              {photo && (
                <img src={photo} alt="Attached" className="mt-2 max-w-full h-32 object-cover" />
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Withdraw Funds</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
