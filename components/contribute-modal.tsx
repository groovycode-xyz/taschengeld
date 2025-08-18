import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { IconComponent } from './icon-component';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { TrendingUp, PiggyBank as PiggyBankIcon } from 'lucide-react';
import { SavingsGoal } from '@/app/types/savingsGoal';
import { User } from '@/app/types/user';
import { PiggyBankAccount } from '@/app/types/piggyBankAccount';

interface ContributeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContribute: (amount: number, piggybankAccountId: number, description?: string) => Promise<void>;
  goal: SavingsGoal;
  users: User[];
}

export function ContributeModal({
  isOpen,
  onClose,
  onContribute,
  goal,
  users,
}: ContributeModalProps) {
  const { addToast } = useToast();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [piggybankAccount, setPiggybankAccount] = useState<PiggyBankAccount | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch piggybank account for the goal's user
  useEffect(() => {
    if (isOpen && goal.user_id) {
      fetchPiggybankAccount();
    }
  }, [isOpen, goal.user_id]);

  const fetchPiggybankAccount = async () => {
    try {
      const response = await fetch(`/api/piggy-bank/accounts?user_id=${goal.user_id}`);
      if (!response.ok) throw new Error('Failed to fetch piggy bank account');
      const accounts = await response.json();
      const userAccount = accounts.find((acc: PiggyBankAccount) => acc.user_id === goal.user_id);
      setPiggybankAccount(userAccount || null);
    } catch (_error) {
      addToast({
        title: 'Error',
        description: 'Failed to load piggy bank account information',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setAmount('');
    setDescription('');
  };

  const validateForm = () => {
    if (!piggybankAccount) {
      addToast({
        title: 'Error',
        description: 'No piggy bank account found for this user',
        variant: 'destructive',
      });
      return false;
    }

    const contributionAmount = parseFloat(amount);
    if (isNaN(contributionAmount) || contributionAmount <= 0) {
      addToast({
        title: 'Validation Error',
        description: 'Contribution amount must be a positive number',
        variant: 'destructive',
      });
      return false;
    }

    const accountBalance = parseFloat(piggybankAccount.balance);
    if (contributionAmount > accountBalance) {
      addToast({
        title: 'Insufficient Funds',
        description: 'Contribution amount cannot exceed piggy bank balance',
        variant: 'destructive',
      });
      return false;
    }

    if (contributionAmount > 10000) {
      addToast({
        title: 'Validation Error',
        description: 'Contribution amount cannot exceed 10,000',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !piggybankAccount) return;

    setIsSubmitting(true);

    try {
      await onContribute(
        parseFloat(amount),
        piggybankAccount.account_id,
        description.trim() || undefined
      );

      addToast({
        title: 'Success',
        description: 'Contribution added successfully!',
      });

      resetForm();
      onClose();
    } catch (error) {
      addToast({
        title: 'Error',
        description: 'Failed to add contribution. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const currentBalance = parseFloat(goal.current_balance);
  const targetAmount = parseFloat(goal.target_amount);
  const contributionAmount = parseFloat(amount) || 0;
  const newBalance = currentBalance + contributionAmount;
  const newProgressPercentage = Math.min((newBalance / targetAmount) * 100, 100);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <TrendingUp className='h-5 w-5' />
            Contribute to Goal
          </DialogTitle>
          <DialogDescription>
            Transfer money from {goal.user_name}'s piggy bank to their savings goal.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Goal Information */}
          <div className='bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg space-y-3'>
            <div className='flex items-center gap-3'>
              <IconComponent icon={goal.icon_name} className='h-8 w-8 text-blue-600' />
              <div>
                <div className='font-medium'>{goal.title}</div>
                <div className='text-sm text-muted-foreground'>{goal.user_name}</div>
              </div>
            </div>
            <div className='grid grid-cols-2 gap-4 text-sm'>
              <div>
                <div className='text-muted-foreground'>Current</div>
                <CurrencyDisplay value={currentBalance} className='font-semibold' />
              </div>
              <div>
                <div className='text-muted-foreground'>Target</div>
                <CurrencyDisplay value={targetAmount} className='font-semibold' />
              </div>
            </div>
          </div>

          {/* Piggy Bank Balance */}
          {piggybankAccount && (
            <div className='bg-green-50 dark:bg-green-950/20 p-4 rounded-lg'>
              <div className='flex items-center gap-2 mb-2'>
                <PiggyBankIcon className='h-5 w-5 text-green-600' />
                <span className='font-medium'>Available in Piggy Bank</span>
              </div>
              <CurrencyDisplay
                value={parseFloat(piggybankAccount.balance)}
                className='text-lg font-semibold text-green-700 dark:text-green-300'
              />
            </div>
          )}

          {/* Contribution Amount */}
          <div className='space-y-2'>
            <Label htmlFor='amount'>Contribution Amount</Label>
            <Input
              id='amount'
              type='number'
              step='0.01'
              min='0.01'
              max={piggybankAccount ? piggybankAccount.balance : '10000'}
              placeholder='0.00'
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            {piggybankAccount && (
              <div className='text-sm text-muted-foreground'>
                Maximum: <CurrencyDisplay value={parseFloat(piggybankAccount.balance)} />
              </div>
            )}
          </div>

          {/* Description */}
          <div className='space-y-2'>
            <Label htmlFor='description'>Description (optional)</Label>
            <Textarea
              id='description'
              placeholder='Add a note about this contribution...'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          {/* Preview */}
          {contributionAmount > 0 && (
            <div className='bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg space-y-2'>
              <div className='font-medium text-sm'>After contribution:</div>
              <div className='grid grid-cols-2 gap-4 text-sm'>
                <div>
                  <div className='text-muted-foreground'>New Goal Balance</div>
                  <CurrencyDisplay value={newBalance} className='font-semibold text-blue-600' />
                </div>
                <div>
                  <div className='text-muted-foreground'>Progress</div>
                  <div className='font-semibold text-blue-600'>
                    {newProgressPercentage.toFixed(1)}%
                  </div>
                </div>
              </div>
              {newBalance >= targetAmount && (
                <div className='text-green-600 font-medium text-sm'>
                  🎉 Goal will be completed!
                </div>
              )}
            </div>
          )}

          <DialogFooter className='flex gap-2 sm:gap-0'>
            <Button type='button' variant='outline' onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={isSubmitting || !piggybankAccount || parseFloat(piggybankAccount.balance) === 0}
            >
              {isSubmitting ? 'Contributing...' : 'Contribute'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}