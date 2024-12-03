'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle } from '../components/ui/card';
import { IconComponent } from './icon-component';
import { CurrencyDisplay } from '@/components/ui/currency-display';
import { Button } from '../components/ui/button';
import { AddFundsModal } from './add-funds-modal';
import { WithdrawFundsModal } from './withdraw-funds-modal';
import { TransactionHistoryModal } from './transaction-history-modal';
import { PiggyBankUser } from '@/app/types/piggyBankUser';
import { useMode } from '@/components/context/mode-context';
import { HandCoins } from 'lucide-react';

export function PiggyBank() {
  const { isParentMode } = useMode();
  const [users, setUsers] = useState<PiggyBankUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<PiggyBankUser | null>(null);
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
      setUsers(data);
    } catch (error) {
      setError('Failed to load piggy bank data');
      console.error(error);
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
          account_id: selectedAccount?.account.account_id,
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
      console.error('Error adding funds:', error);
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
          account_id: selectedAccount?.account.account_id,
          amount: -amount, // Negative amount for withdrawal
          transaction_type: 'withdrawal',
          description: comments,
          photo,
        }),
      });

      if (!response.ok) throw new Error('Failed to withdraw funds');
      await fetchPiggyBankData(); // Refresh data
      setIsWithdrawFundsModalOpen(false);
    } catch (error) {
      console.error('Error withdrawing funds:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='p-8 bg-[#FBFBFB] rounded-2xl space-y-8 max-w-7xl mx-auto'>
      <div className='flex justify-between items-center pb-6 border-b border-gray-200'>
        <h1 className='text-3xl font-bold flex items-center'>
          <HandCoins className='mr-3 h-10 w-10' />
          Sparkässeli
        </h1>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {users.map((user) => (
          <Card
            key={user.user_id}
            className='overflow-hidden shadow-md backdrop-blur-sm bg-green-100/50 border border-green-200 hover:border-green-300 transition-all duration-200'
          >
            <CardHeader className='flex flex-col items-center text-center'>
              <IconComponent
                icon={user.icon}
                className='w-20 h-20 mb-2 text-green-700'
              />
              <CardTitle className='mb-2 text-green-900'>
                {user.name}
              </CardTitle>
              <div className='text-2xl font-bold mb-4 text-green-700'>
                <CurrencyDisplay
                  value={parseFloat(user.account.balance)}
                  className='text-2xl font-bold text-green-700'
                />
              </div>
              <div className='flex flex-col gap-2 w-full'>
                {isParentMode && (
                  <div className='flex gap-2'>
                    <Button
                      onClick={() => {
                        setSelectedAccount(user);
                        setIsAddFundsModalOpen(true);
                      }}
                      className='bg-green-600 hover:bg-green-700 text-white flex-1 font-semibold'
                    >
                      Deposit
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedAccount(user);
                        setIsWithdrawFundsModalOpen(true);
                      }}
                      className='bg-red-600 hover:bg-red-700 text-white flex-1 font-semibold'
                    >
                      Withdraw
                    </Button>
                  </div>
                )}
                <Button
                  onClick={() => {
                    setSelectedAccount(user);
                    setIsTransactionsModalOpen(true);
                  }}
                  className='bg-blue-600 hover:bg-blue-700 text-white w-full font-semibold'
                >
                  Transactions
                </Button>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {selectedAccount && (
        <>
          <AddFundsModal
            isOpen={isAddFundsModalOpen}
            onClose={() => setIsAddFundsModalOpen(false)}
            onAddFunds={handleAddFunds}
            userName={selectedAccount.name}
            userIcon={selectedAccount.icon}
          />
          <WithdrawFundsModal
            isOpen={isWithdrawFundsModalOpen}
            onClose={() => setIsWithdrawFundsModalOpen(false)}
            onWithdrawFunds={handleWithdrawFunds}
            balance={parseFloat(selectedAccount.account.balance)}
            userName={selectedAccount.name}
            userIcon={selectedAccount.icon}
          />
          <TransactionHistoryModal
            isOpen={isTransactionsModalOpen}
            onClose={() => setIsTransactionsModalOpen(false)}
            user={selectedAccount}
          />
        </>
      )}
    </div>
  );
}
