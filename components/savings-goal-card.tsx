'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IconComponent } from './icon-component';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { useMode } from '@/components/context/mode-context';
import { Edit, TrendingUp, TrendingDown, ShoppingCart, History } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SavingsGoal } from '@/app/types/savingsGoal';
import { User } from '@/app/types/user';
import { CreateEditGoalModal } from './create-edit-goal-modal';
import { ContributeModal } from './contribute-modal';
import { WithdrawModal } from './withdraw-modal';
import { SavingsGoalTransactionModal } from './savings-goal-transaction-modal';

interface SavingsGoalCardProps {
  goal: SavingsGoal;
  onUpdate: () => void;
  users: User[];
}

export function SavingsGoalCard({ goal, onUpdate, users }: SavingsGoalCardProps) {
  const { isParentMode, enforceRoles } = useMode();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isContributeModalOpen, setIsContributeModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

  const currentBalance = parseFloat(goal.current_balance);
  const targetAmount = parseFloat(goal.target_amount);
  const progressPercentage = Math.min((currentBalance / targetAmount) * 100, 100);

  const handleUpdateGoal = async (goalData: {
    title?: string;
    description?: string;
    icon_name?: string;
    target_amount?: number;
    is_active?: boolean;
  }) => {
    try {
      const response = await fetch('/api/savings-goals', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          goal_id: goal.goal_id,
          ...goalData,
        }),
      });

      if (!response.ok) throw new Error('Failed to update savings goal');
      setIsEditModalOpen(false);
      onUpdate();
    } catch (_error) {
      // Error updating goal - handled by the modal component
    }
  };

  const handleContribute = async (amount: number, piggybankAccountId: number, description?: string) => {
    try {
      const response = await fetch(`/api/savings-goals/${goal.goal_id}/contribute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          piggybank_account_id: piggybankAccountId,
          description,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to contribute to savings goal');
      }

      setIsContributeModalOpen(false);
      onUpdate();
    } catch (_error) {
      // Error contributing - handled by the modal component
    }
  };

  const handleWithdraw = async (
    amount: number,
    piggybankAccountId: number,
    description?: string,
    isPurchase?: boolean
  ) => {
    try {
      const endpoint = isPurchase 
        ? `/api/savings-goals/${goal.goal_id}/purchase` 
        : `/api/savings-goals/${goal.goal_id}/withdraw`;
      const body = isPurchase
        ? { description }
        : { amount, piggybank_account_id: piggybankAccountId, description };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${isPurchase ? 'purchase' : 'withdraw'}`);
      }

      setIsWithdrawModalOpen(false);
      onUpdate();
    } catch (_error) {
      // Error handling - handled by the modal component
    }
  };

  return (
    <>
      <Card
        className={cn(
          goal.is_active
            ? 'bg-blue-100/50 hover:bg-blue-200/50 dark:bg-blue-900/10 dark:hover:bg-blue-800/20'
            : 'bg-gray-100/50 hover:bg-gray-200/50 dark:bg-gray-900/10 dark:hover:bg-gray-800/20',
          'transition-all duration-200 shadow-md',
          !goal.is_active && 'opacity-75'
        )}
      >
        <CardHeader className='pb-4'>
          <CardTitle className='flex flex-col items-center space-y-4'>
            <IconComponent
              icon={goal.icon_name}
              className={cn(
                'h-16 w-16',
                goal.is_active
                  ? 'text-blue-700 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-400'
              )}
            />
            <div className='text-center space-y-2'>
              <div className={cn(
                'text-lg font-medium',
                goal.is_active
                  ? 'text-blue-900 dark:text-blue-100'
                  : 'text-gray-700 dark:text-gray-300'
              )}>
                {goal.title}
              </div>
              <div className='flex items-center justify-center gap-2 text-sm text-muted-foreground'>
                <IconComponent
                  icon={goal.user_icon}
                  className='h-6 w-6'
                />
                <span>{goal.user_name}</span>
              </div>
              {goal.description && (
                <div className='text-sm text-muted-foreground'>
                  {goal.description}
                </div>
              )}
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className='space-y-4'>
          {/* Progress Section */}
          <div className='space-y-2'>
            <div className='flex justify-between text-sm'>
              <span className='text-muted-foreground'>Progress</span>
              <span className='font-medium'>{progressPercentage.toFixed(1)}%</span>
            </div>
            <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3'>
              <div
                className={cn(
                  'h-3 rounded-full transition-all duration-300',
                  goal.is_active
                    ? 'bg-blue-600 dark:bg-blue-500'
                    : 'bg-gray-500 dark:bg-gray-400'
                )}
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>
          </div>

          {/* Balance Information */}
          <div className='space-y-2'>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-muted-foreground'>Current:</span>
              <CurrencyDisplay
                value={currentBalance}
                className={cn(
                  'text-lg font-semibold',
                  goal.is_active
                    ? 'text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-400'
                )}
              />
            </div>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-muted-foreground'>Target:</span>
              <CurrencyDisplay
                value={targetAmount}
                className='text-lg font-semibold text-foreground'
              />
            </div>
          </div>

          {/* Action Buttons */}
          {(!enforceRoles || isParentMode) && (
            <div className='space-y-2 pt-2'>
              <div className='grid grid-cols-2 gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  className='flex-1'
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <Edit className='h-4 w-4 mr-1' />
                  Edit
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  className='flex-1'
                  onClick={() => setIsTransactionModalOpen(true)}
                >
                  <History className='h-4 w-4 mr-1' />
                  Transactions
                </Button>
                {goal.is_active && (
                  <Button
                    variant='default'
                    size='sm'
                    className={cn(
                      'flex-1',
                      'bg-green-600 hover:bg-green-700',
                      'dark:bg-green-700 dark:hover:bg-green-600',
                      'text-white'
                    )}
                    onClick={() => setIsContributeModalOpen(true)}
                  >
                    <TrendingUp className='h-4 w-4 mr-1' />
                    Contribute
                  </Button>
                )}
                {goal.is_active && currentBalance > 0 && (
                  <Button
                    variant='default'
                    size='sm'
                    className={cn(
                      'flex-1',
                      'bg-orange-600 hover:bg-orange-700',
                      'dark:bg-orange-700 dark:hover:bg-orange-600',
                      'text-white'
                    )}
                    onClick={() => setIsWithdrawModalOpen(true)}
                  >
                    <TrendingDown className='h-4 w-4 mr-1' />
                    Withdraw
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Goal Status Badge */}
          {!goal.is_active && (
            <div className='pt-2'>
              <div className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'>
                <ShoppingCart className='h-3 w-3 mr-1' />
                Completed
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <CreateEditGoalModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleUpdateGoal}
        users={users}
        mode='edit'
        existingGoal={goal}
      />

      <ContributeModal
        isOpen={isContributeModalOpen}
        onClose={() => setIsContributeModalOpen(false)}
        onContribute={handleContribute}
        goal={goal}
        users={users}
      />

      <WithdrawModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        onWithdraw={handleWithdraw}
        goal={goal}
        users={users}
      />

      <SavingsGoalTransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        goal={goal}
      />
    </>
  );
}