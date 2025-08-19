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
import {
  TrendingDown,
  ShoppingCart,
  PiggyBank as PiggyBankIcon,
  AlertTriangle,
} from 'lucide-react';
import { SavingsGoal } from '@/app/types/savingsGoal';
import { User } from '@/app/types/user';
import { PiggyBankAccount } from '@/app/types/piggyBankAccount';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWithdraw: (
    amount: number,
    piggybankAccountId: number,
    description?: string,
    isPurchase?: boolean
  ) => Promise<void>;
  goal: SavingsGoal;
  users: User[];
}

export function WithdrawModal({ isOpen, onClose, onWithdraw, goal, users }: WithdrawModalProps) {
  const { addToast } = useToast();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [piggybankAccount, setPiggybankAccount] = useState<PiggyBankAccount | null>(null);
  const [withdrawalType, setWithdrawalType] = useState<'transfer' | 'purchase'>('transfer');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPurchaseConfirm, setShowPurchaseConfirm] = useState(false);

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
    setWithdrawalType('transfer');
    setShowPurchaseConfirm(false);
  };

  const validateForm = () => {
    if (withdrawalType === 'transfer') {
      if (!piggybankAccount) {
        addToast({
          title: 'Error',
          description: 'No piggy bank account found for this user',
          variant: 'destructive',
        });
        return false;
      }

      const withdrawalAmount = parseFloat(amount);
      if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
        addToast({
          title: 'Validation Error',
          description: 'Transfer amount must be a positive number',
          variant: 'destructive',
        });
        return false;
      }

      const goalBalance = parseFloat(goal.current_balance);
      if (withdrawalAmount > goalBalance) {
        addToast({
          title: 'Insufficient Funds',
          description: 'Transfer amount cannot exceed goal balance',
          variant: 'destructive',
        });
        return false;
      }

      if (withdrawalAmount > 10000) {
        addToast({
          title: 'Validation Error',
          description: 'Transfer amount cannot exceed 10,000',
          variant: 'destructive',
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (withdrawalType === 'purchase' && !showPurchaseConfirm) {
      setShowPurchaseConfirm(true);
      return;
    }

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      if (withdrawalType === 'purchase') {
        // Purchase uses entire balance and marks goal inactive
        await onWithdraw(0, 0, description.trim() || undefined, true);
      } else {
        // Transfer to piggy bank
        if (!piggybankAccount) throw new Error('Piggy bank account not found');
        await onWithdraw(
          parseFloat(amount),
          piggybankAccount.account_id,
          description.trim() || undefined,
          false
        );
      }

      addToast({
        title: 'Success',
        description:
          withdrawalType === 'purchase'
            ? 'Purchase completed successfully!'
            : 'Transfer completed successfully!',
      });

      resetForm();
      onClose();
    } catch (error) {
      addToast({
        title: 'Error',
        description: `Failed to ${withdrawalType === 'purchase' ? 'complete purchase' : 'transfer funds'}. Please try again.`,
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
  const withdrawalAmount = parseFloat(amount) || 0;
  const newBalance = withdrawalType === 'purchase' ? 0 : currentBalance - withdrawalAmount;

  if (showPurchaseConfirm) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <AlertTriangle className='h-5 w-5 text-orange-500' />
              Confirm Purchase
            </DialogTitle>
            <DialogDescription>
              This action will complete your goal and cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4'>
            <div className='bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800'>
              <div className='flex items-start gap-3'>
                <AlertTriangle className='h-5 w-5 text-orange-600 mt-0.5' />
                <div className='space-y-2'>
                  <div className='font-medium text-orange-900 dark:text-orange-100'>This will:</div>
                  <ul className='text-sm text-orange-800 dark:text-orange-200 space-y-1'>
                    <li>
                      • Use the entire goal balance (<CurrencyDisplay value={currentBalance} />)
                    </li>
                    <li>• Mark the goal as completed (inactive)</li>
                    <li>• This action cannot be undone</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='purchaseDescription'>Purchase Description</Label>
              <Textarea
                id='purchaseDescription'
                placeholder='What did you purchase? (optional)'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className='flex gap-2 sm:gap-0'>
            <Button type='button' variant='outline' onClick={() => setShowPurchaseConfirm(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className='bg-orange-600 hover:bg-orange-700 text-white'
            >
              {isSubmitting ? 'Completing...' : 'Complete Purchase'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <TrendingDown className='h-5 w-5' />
            Withdraw from Goal
          </DialogTitle>
          <DialogDescription>Choose how to use your savings goal balance.</DialogDescription>
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
            <div className='text-center'>
              <div className='text-sm text-muted-foreground'>Available Balance</div>
              <CurrencyDisplay
                value={currentBalance}
                className='text-2xl font-bold text-blue-600'
              />
            </div>
          </div>

          {/* Withdrawal Type Selection */}
          <div className='space-y-3'>
            <Label>What would you like to do?</Label>

            <div className='grid grid-cols-1 gap-3'>
              {/* Transfer Option */}
              <button
                type='button'
                onClick={() => setWithdrawalType('transfer')}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  withdrawalType === 'transfer'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className='flex items-center gap-3'>
                  <PiggyBankIcon className='h-6 w-6 text-green-600' />
                  <div>
                    <div className='font-medium'>Transfer to Piggy Bank</div>
                    <div className='text-sm text-muted-foreground'>
                      Move money back to the piggy bank for other uses
                    </div>
                  </div>
                </div>
              </button>

              {/* Purchase Option */}
              <button
                type='button'
                onClick={() => setWithdrawalType('purchase')}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  withdrawalType === 'purchase'
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className='flex items-center gap-3'>
                  <ShoppingCart className='h-6 w-6 text-orange-600' />
                  <div>
                    <div className='font-medium'>Complete Purchase</div>
                    <div className='text-sm text-muted-foreground'>
                      Use all savings to purchase your goal item
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Transfer Amount (only for transfer type) */}
          {withdrawalType === 'transfer' && (
            <div className='space-y-2'>
              <Label htmlFor='amount'>Transfer Amount</Label>
              <Input
                id='amount'
                type='number'
                step='0.01'
                min='0.01'
                max={goal.current_balance}
                placeholder='0.00'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              <div className='text-sm text-muted-foreground'>
                Maximum: <CurrencyDisplay value={currentBalance} />
              </div>
            </div>
          )}

          {/* Description */}
          <div className='space-y-2'>
            <Label htmlFor='description'>
              {withdrawalType === 'purchase'
                ? 'Purchase Description (optional)'
                : 'Transfer Description (optional)'}
            </Label>
            <Textarea
              id='description'
              placeholder={
                withdrawalType === 'purchase'
                  ? 'What did you buy?'
                  : 'Add a note about this transfer...'
              }
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          {/* Preview (only for transfer) */}
          {withdrawalType === 'transfer' && withdrawalAmount > 0 && (
            <div className='bg-green-50 dark:bg-green-950/20 p-4 rounded-lg space-y-2'>
              <div className='font-medium text-sm'>After transfer:</div>
              <div className='grid grid-cols-2 gap-4 text-sm'>
                <div>
                  <div className='text-muted-foreground'>Remaining in Goal</div>
                  <CurrencyDisplay value={newBalance} className='font-semibold text-blue-600' />
                </div>
                <div>
                  <div className='text-muted-foreground'>Added to Piggy Bank</div>
                  <CurrencyDisplay
                    value={withdrawalAmount}
                    className='font-semibold text-green-600'
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter className='flex gap-2 sm:gap-0'>
            <Button type='button' variant='outline' onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={
                isSubmitting ||
                (withdrawalType === 'transfer' && (!piggybankAccount || currentBalance === 0))
              }
              className={
                withdrawalType === 'purchase'
                  ? 'bg-orange-600 hover:bg-orange-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }
            >
              {isSubmitting
                ? withdrawalType === 'purchase'
                  ? 'Processing...'
                  : 'Transferring...'
                : withdrawalType === 'purchase'
                  ? 'Make Purchase'
                  : 'Transfer to Piggy Bank'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
