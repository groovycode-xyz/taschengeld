import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AddFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFunds: (amount: number) => void;
  userName: string;
}

export function AddFundsModal({ isOpen, onClose, onAddFunds, userName }: AddFundsModalProps) {
  const [amount, setAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!isNaN(numAmount) && numAmount > 0) {
      onAddFunds(numAmount);
      setAmount('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Funds for {userName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="flex items-center mb-4">
            <label htmlFor="amount" className="mr-2 text-sm font-medium text-gray-700">
              Amount
            </label>
            <Input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              min="0.01"
              step="0.01"
              required
            />
          </div>
          <div className="flex justify-end">
            <Button type="button" variant="outline" onClick={onClose} className="mr-2">
              Cancel
            </Button>
            <Button type="submit">Add Funds</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
