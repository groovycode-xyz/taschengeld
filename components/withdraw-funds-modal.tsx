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

interface WithdrawFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWithdrawFunds: (amount: number) => void;
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
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!isNaN(numAmount) && numAmount > 0 && numAmount <= balance) {
      onWithdrawFunds(numAmount);
      setAmount('');
      setError('');
      onClose();
    } else if (numAmount > balance) {
      setError('Insufficient funds');
    } else {
      setError('Please enter a valid amount');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Withdraw Funds for {userName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="balance" className="block text-sm font-medium text-gray-700">
              Current Balance
            </Label>
            <div className="mt-1 text-lg font-semibold">${balance.toFixed(2)}</div>
          </div>
          <div className="mb-4">
            <Label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Amount
            </Label>
            <Input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              min="0.01"
              step="0.01"
              max={balance}
              required
              className="mt-1"
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Withdraw Funds</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
