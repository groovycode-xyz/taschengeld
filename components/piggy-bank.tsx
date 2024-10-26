'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle } from '../components/ui/card';
import { IconComponent } from './icon-component';
import { formatCurrency } from '../lib/utils';
import { Button } from '../components/ui/button';
import { AddFundsModal } from './add-funds-modal';
import { WithdrawFundsModal } from './withdraw-funds-modal';
import { TransactionHistoryModal } from './transaction-history-modal';
import { PiggyBankUser } from '@/app/types/piggyBankUser';

export function PiggyBank() {
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
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Sparkässeli</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <Card key={user.user_id} className="overflow-hidden">
            <CardHeader className="bg-blue-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <IconComponent icon={user.icon} className="w-12 h-12" />
                  <CardTitle>{user.name}</CardTitle>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(parseFloat(user.account.balance))}
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={() => {
                    setSelectedAccount(user);
                    setIsAddFundsModalOpen(true);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white flex-1"
                >
                  Deposit
                </Button>
                <Button
                  onClick={() => {
                    setSelectedAccount(user);
                    setIsWithdrawFundsModalOpen(true);
                  }}
                  className="bg-rose-600 hover:bg-rose-700 text-white flex-1"
                >
                  Withdraw
                </Button>
              </div>
              <div className="mt-2">
                <Button
                  onClick={() => {
                    setSelectedAccount(user);
                    setIsTransactionsModalOpen(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white w-full"
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
