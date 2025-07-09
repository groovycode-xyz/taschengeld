'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { IconComponent } from './icon-component';

interface PiggyBankAccount {
  account_id: number;
  user_id: number | null;
  user_name: string;
  user_icon: string;
  balance: number;
}

interface TransactionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: PiggyBankAccount;
}

interface Transaction {
  transaction_id: number;
  amount: string;
  description: string;
  transaction_date: string;
  transaction_type: 'deposit' | 'withdrawal';
  task_title?: string;
}

interface GroupedTransactions {
  label: string;
  transactions: Transaction[];
}

function getWeekLabel(date: Date): string {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));

  if (diffWeeks === 0) return 'This Week';
  if (diffWeeks === 1) return 'Last Week';
  return `${diffWeeks} Weeks Ago`;
}

function groupTransactionsByWeek(transactions: Transaction[]): GroupedTransactions[] {
  const grouped = transactions.reduce((acc: { [key: string]: Transaction[] }, transaction) => {
    const date = new Date(transaction.transaction_date);
    const weekLabel = getWeekLabel(date);

    if (!acc[weekLabel]) {
      acc[weekLabel] = [];
    }
    acc[weekLabel].push(transaction);
    return acc;
  }, {});

  return Object.entries(grouped).map(([label, transactions]) => ({
    label,
    transactions,
  }));
}

export function TransactionHistoryModal({ isOpen, onClose, user }: TransactionHistoryModalProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    if (!user) return;
    try {
      const response = await fetch(`/api/piggy-bank/transactions?accountId=${user.account_id}`);
      if (!response.ok) throw new Error('Failed to fetch transactions');
      const data = await response.json();
      setTransactions(data);
    } catch (_error) {
      // Error fetching transactions
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isOpen && user) {
      fetchTransactions();
    }
  }, [isOpen, user, fetchTransactions]);

  const groupedTransactions = groupTransactionsByWeek(transactions);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-2xl h-[80vh] flex flex-col p-0'>
        <div className='px-6 py-4 border-b'>
          <DialogHeader>
            <div className='flex items-center gap-3'>
              <IconComponent icon={user.user_icon} className='h-8 w-8' />
              <div>
                <DialogTitle>Transaction History</DialogTitle>
                <p className='text-sm text-gray-500'>{user.user_name}</p>
              </div>
            </div>
          </DialogHeader>
        </div>

        <ScrollArea className='flex-1 p-6'>
          <div className='space-y-6'>
            {isLoading ? (
              <p className='text-center text-gray-500'>Loading transactions...</p>
            ) : transactions.length === 0 ? (
              <p className='text-center text-gray-500'>No transactions found</p>
            ) : (
              groupedTransactions.map((group) => (
                <div key={group.label} className='space-y-3'>
                  <div className='sticky top-0 bg-white py-2'>
                    <h3 className='text-sm font-medium text-gray-500 border-b pb-2'>
                      {group.label}
                    </h3>
                  </div>
                  {group.transactions.map((transaction) => (
                    <div
                      key={transaction.transaction_id}
                      className={`p-4 rounded-lg border ${
                        ['deposit', 'payday'].includes(transaction.transaction_type)
                          ? 'bg-green-50 border-green-200'
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className='flex justify-between items-start'>
                        <div className='space-y-1'>
                          <p className='font-medium'>
                            {transaction.task_title || transaction.description}
                          </p>
                          <p className='text-sm text-gray-600'>
                            {new Date(transaction.transaction_date).toLocaleDateString(undefined, {
                              weekday: 'long',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                        <span
                          className={`font-semibold ${
                            ['deposit', 'payday'].includes(transaction.transaction_type)
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {['deposit', 'payday'].includes(transaction.transaction_type) ? '+' : '-'}
                          <CurrencyDisplay
                            value={Math.abs(parseFloat(transaction.amount))}
                            className='font-semibold'
                          />
                        </span>
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
