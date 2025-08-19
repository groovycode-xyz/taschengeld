'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { IconComponent } from './icon-component';
import { TrendingUp, TrendingDown, ShoppingCart } from 'lucide-react';
import { SavingsGoal } from '@/app/types/savingsGoal';

interface SavingsGoalTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: SavingsGoal;
}

interface SavingsGoalTransaction {
  transaction_id: number;
  goal_id: number;
  amount: string;
  transaction_type: 'contribute' | 'withdraw' | 'purchase';
  transaction_date: string;
  description?: string;
  from_piggybank: boolean;
  goal_title: string;
}

interface GroupedTransactions {
  label: string;
  transactions: SavingsGoalTransaction[];
}

function getWeekLabel(date: Date): string {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));

  if (diffWeeks === 0) return 'This Week';
  if (diffWeeks === 1) return 'Last Week';
  return `${diffWeeks} Weeks Ago`;
}

function groupTransactionsByWeek(transactions: SavingsGoalTransaction[]): GroupedTransactions[] {
  const grouped = transactions.reduce(
    (acc: { [key: string]: SavingsGoalTransaction[] }, transaction) => {
      const date = new Date(transaction.transaction_date);
      const weekLabel = getWeekLabel(date);

      if (!acc[weekLabel]) {
        acc[weekLabel] = [];
      }
      acc[weekLabel].push(transaction);
      return acc;
    },
    {}
  );

  return Object.entries(grouped).map(([label, transactions]) => ({
    label,
    transactions,
  }));
}

function getTransactionIcon(transaction: SavingsGoalTransaction) {
  switch (transaction.transaction_type) {
    case 'contribute':
      return <TrendingUp className='h-4 w-4 text-green-600' />;
    case 'withdraw':
      return <TrendingDown className='h-4 w-4 text-blue-600' />;
    case 'purchase':
      return <ShoppingCart className='h-4 w-4 text-orange-600' />;
    default:
      return <TrendingUp className='h-4 w-4 text-gray-600' />;
  }
}

function getTransactionStyle(transaction: SavingsGoalTransaction) {
  switch (transaction.transaction_type) {
    case 'contribute':
      return 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800';
    case 'withdraw':
      return 'bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800';
    case 'purchase':
      return 'bg-orange-50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-800';
    default:
      return 'bg-gray-50 border-gray-200 dark:bg-gray-950/20 dark:border-gray-800';
  }
}

function getTransactionLabel(transaction: SavingsGoalTransaction): string {
  switch (transaction.transaction_type) {
    case 'contribute':
      return 'Contribution';
    case 'withdraw':
      return 'Withdrawal';
    case 'purchase':
      return 'Purchase';
    default:
      return 'Transaction';
  }
}

export function SavingsGoalTransactionModal({
  isOpen,
  onClose,
  goal,
}: SavingsGoalTransactionModalProps) {
  const [transactions, setTransactions] = useState<SavingsGoalTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    if (!goal) return;
    try {
      const response = await fetch(`/api/savings-goals/transactions?goal_id=${goal.goal_id}`);
      if (!response.ok) throw new Error('Failed to fetch savings goal transactions');
      const data = await response.json();
      setTransactions(data);
    } catch (_error) {
      // Error fetching transactions
    } finally {
      setIsLoading(false);
    }
  }, [goal]);

  useEffect(() => {
    if (isOpen && goal) {
      fetchTransactions();
    }
  }, [isOpen, goal, fetchTransactions]);

  const groupedTransactions = groupTransactionsByWeek(transactions);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-2xl h-[80vh] flex flex-col p-0'>
        <div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
          <DialogHeader>
            <div className='flex items-center gap-3'>
              <IconComponent icon={goal.icon_name} className='h-8 w-8 text-blue-600' />
              <div>
                <DialogTitle className='text-xl font-semibold text-gray-900 dark:text-gray-100'>
                  Transaction History
                </DialogTitle>
                <p className='text-sm text-gray-600 dark:text-gray-400'>{goal.title}</p>
                <div className='flex items-center gap-4 mt-1 text-sm text-gray-500 dark:text-gray-400'>
                  <span>
                    Balance:{' '}
                    <CurrencyDisplay
                      value={parseFloat(goal.current_balance)}
                      className='font-medium'
                    />
                  </span>
                  <span>
                    Target:{' '}
                    <CurrencyDisplay
                      value={parseFloat(goal.target_amount)}
                      className='font-medium'
                    />
                  </span>
                </div>
              </div>
            </div>
          </DialogHeader>
        </div>

        <ScrollArea className='flex-1 p-6'>
          <div className='space-y-6'>
            {isLoading ? (
              <p className='text-center text-gray-500 dark:text-gray-400'>
                Loading transactions...
              </p>
            ) : transactions.length === 0 ? (
              <div className='text-center py-8'>
                <IconComponent
                  icon={goal.icon_name}
                  className='h-12 w-12 mx-auto mb-3 text-gray-400'
                />
                <p className='text-gray-500 dark:text-gray-400'>No transactions yet</p>
                <p className='text-sm text-gray-400 dark:text-gray-500'>
                  Contributions and withdrawals will appear here
                </p>
              </div>
            ) : (
              groupedTransactions.map((group) => (
                <div key={group.label} className='space-y-3'>
                  <div className='sticky top-0 bg-white dark:bg-gray-950 py-2 z-10'>
                    <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 pb-2'>
                      {group.label}
                    </h3>
                  </div>
                  {group.transactions.map((transaction) => (
                    <div
                      key={transaction.transaction_id}
                      className={`p-4 rounded-lg border transition-all duration-200 ${getTransactionStyle(transaction)}`}
                    >
                      <div className='flex justify-between items-start'>
                        <div className='flex items-start gap-3 flex-1'>
                          <div className='mt-0.5'>{getTransactionIcon(transaction)}</div>
                          <div className='space-y-1 flex-1'>
                            <div className='flex items-center gap-2'>
                              <span className='font-medium text-gray-900 dark:text-gray-100'>
                                {getTransactionLabel(transaction)}
                              </span>
                              {transaction.from_piggybank !== null && (
                                <span className='text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'>
                                  {transaction.from_piggybank ? 'From Piggy Bank' : 'To Piggy Bank'}
                                </span>
                              )}
                            </div>
                            {transaction.description && (
                              <p className='text-sm text-gray-600 dark:text-gray-400'>
                                {transaction.description}
                              </p>
                            )}
                            <p className='text-xs text-gray-500 dark:text-gray-500'>
                              {new Date(transaction.transaction_date).toLocaleDateString(
                                undefined,
                                {
                                  weekday: 'long',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                }
                              )}
                            </p>
                          </div>
                        </div>
                        <div className='text-right'>
                          <span
                            className={`font-semibold text-lg ${
                              transaction.transaction_type === 'contribute'
                                ? 'text-green-600 dark:text-green-400'
                                : transaction.transaction_type === 'withdraw'
                                  ? 'text-blue-600 dark:text-blue-400'
                                  : 'text-orange-600 dark:text-orange-400'
                            }`}
                          >
                            {transaction.transaction_type === 'contribute' ? '+' : '−'}
                            <CurrencyDisplay
                              value={Math.abs(parseFloat(transaction.amount))}
                              className='font-semibold'
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
