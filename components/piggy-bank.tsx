'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle } from '../components/ui/card';
import { IconComponent } from './icon-component';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { Button } from '../components/ui/button';
import { AddFundsModal } from './add-funds-modal';
import { WithdrawFundsModal } from './withdraw-funds-modal';
import { TransactionHistoryModal } from './transaction-history-modal';
import { useMode } from '@/components/context/mode-context';
import { PiggyBank as PiggyBankIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PiggyBankAccount {
  account_id: number;
  user_id: number | null;
  user_name: string;
  user_icon: string;
  balance: number;
}

export function PiggyBank() {
  const { isParentMode, enforceRoles } = useMode();
  const [users, setUsers] = useState<PiggyBankAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<PiggyBankAccount | null>(null);
  const [isAddFundsModalOpen, setIsAddFundsModalOpen] = useState(false);
  const [isWithdrawFundsModalOpen, setIsWithdrawFundsModalOpen] = useState(false);
  const [isTransactionsModalOpen, setIsTransactionsModalOpen] = useState(false);

  useEffect(() => {
    fetchPiggyBankData();
  }, []);

  const fetchPiggyBankData = async () => {
    try {
      const response = await fetch('/api/piggy-bank/dashboard');
      if (!response.ok) throw new Error('Failed to fetch piggy bank data');
      const data = await response.json();
      setUsers(data.accountBalances || []);
    } catch (error) {
      setError('Failed to load piggy bank data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFunds = async (amount: number, comments: string, photo: string | null) => {
    try {
      const response = await fetch('/api/piggy-bank', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          account_id: selectedAccount?.account_id,
          amount,
          transaction_type: 'deposit',
          description: comments,
          photo,
        }),
      });

      if (!response.ok) throw new Error('Failed to add funds');
      await fetchPiggyBankData(); // Refresh data
      setIsAddFundsModalOpen(false);
    } catch (error) {
      // Error adding funds
    }
  };

  const handleWithdrawFunds = async (amount: number, comments: string, photo: string | null) => {
    try {
      const response = await fetch('/api/piggy-bank', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          account_id: selectedAccount?.account_id,
          amount: amount, // Send positive amount - the service handles decrement for withdrawals
          transaction_type: 'withdrawal',
          description: comments,
          photo,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to withdraw funds');
      }

      const result = await response.json();

      await fetchPiggyBankData(); // Refresh data
    } catch (error) {
      // Error withdrawing funds
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='h-[calc(100vh-4rem)] flex flex-col bg-background'>
      {/* Fixed Header */}
      <div className='p-8 bg-secondary'>
        <div className='flex items-center justify-between pb-6 border-b border-border'>
          <div className='flex items-center space-x-4'>
            <PiggyBankIcon className='h-8 w-8 text-foreground' />
            <h1 className='text-3xl font-medium text-foreground'>Piggy Bank</h1>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className='flex-1 overflow-y-auto p-8 pt-4 bg-secondary'>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
          {users.map((user) => (
            <Card
              key={user.user_id}
              className={cn(
                'bg-green-100/50 hover:bg-green-200/50',
                'dark:bg-green-900/10 dark:hover:bg-green-800/20',
                'transition-all duration-200 shadow-md cursor-pointer'
              )}
              onClick={() => setSelectedAccount(user)}
            >
              <CardHeader className='pb-4'>
                <CardTitle className='flex flex-col items-center space-y-4'>
                  <IconComponent
                    icon={user.user_icon}
                    className={cn('h-24 w-24', 'text-green-700 dark:text-green-300')}
                  />
                  <div className='text-xl font-medium text-green-900 dark:text-green-100 text-center'>
                    {user.user_name}
                  </div>
                  <CurrencyDisplay
                    value={user.balance}
                    className='text-3xl font-bold text-green-700 dark:text-green-300'
                  />
                </CardTitle>
              </CardHeader>
              <div className='p-4 pt-0 flex flex-col gap-2'>
                <div className='flex gap-2'>
                  {(!enforceRoles || isParentMode) && (
                    <>
                      <Button
                        variant='default'
                        className={cn(
                          'flex-1',
                          'bg-green-600 hover:bg-green-700',
                          'dark:bg-green-700 dark:hover:bg-green-600',
                          'text-white'
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAccount(user);
                          setIsAddFundsModalOpen(true);
                        }}
                      >
                        Deposit
                      </Button>
                      <Button
                        variant='default'
                        className={cn(
                          'flex-1',
                          'bg-red-600 hover:bg-red-700',
                          'dark:bg-red-700 dark:hover:bg-red-600',
                          'text-white'
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAccount(user);
                          setIsWithdrawFundsModalOpen(true);
                        }}
                      >
                        Withdraw
                      </Button>
                    </>
                  )}
                </div>
                <Button
                  variant='default'
                  className={cn(
                    'w-full',
                    'bg-blue-600 hover:bg-blue-700',
                    'dark:bg-blue-700 dark:hover:bg-blue-600',
                    'text-white'
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedAccount(user);
                    setIsTransactionsModalOpen(true);
                  }}
                >
                  Transactions
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Modals */}
      {selectedAccount && (
        <>
          <AddFundsModal
            isOpen={isAddFundsModalOpen}
            onClose={() => {
              setIsAddFundsModalOpen(false);
              setSelectedAccount(null);
            }}
            onAddFunds={handleAddFunds}
            userName={selectedAccount.user_name}
            userIcon={selectedAccount.user_icon}
          />
          <WithdrawFundsModal
            isOpen={isWithdrawFundsModalOpen}
            onClose={() => {
              setIsWithdrawFundsModalOpen(false);
              setSelectedAccount(null);
            }}
            onWithdrawFunds={handleWithdrawFunds}
            balance={selectedAccount.balance}
            userName={selectedAccount.user_name}
            userIcon={selectedAccount.user_icon}
          />
          <TransactionHistoryModal
            isOpen={isTransactionsModalOpen}
            onClose={() => {
              setIsTransactionsModalOpen(false);
              setSelectedAccount(null);
            }}
            user={selectedAccount}
          />
        </>
      )}
    </div>
  );
}
