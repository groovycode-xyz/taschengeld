'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AddFundsModal } from './add-funds-modal';
import { WithdrawFundsModal } from './withdraw-funds-modal';
import { TransactionsModal } from './transactions-modal';
import { User } from '@/app/types/user';
import { mockDb } from '@/app/lib/mockDb';
import { IconComponent } from './icon-component';

interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'deposit' | 'withdrawal';
  date: Date;
}

interface UserBalance {
  user: User;
  balance: number;
  transactions: Transaction[];
}

// PiggyBank component: Manages the piggy bank interface for child users
// Displays balances, allows adding/withdrawing funds, and shows transaction history
export function PiggyBank() {
  const [userBalances, setUserBalances] = useState<UserBalance[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isTransactionsModalOpen, setIsTransactionsModalOpen] = useState(false);

  useEffect(() => {
    // Fetch users and their balances
    const childUsers = mockDb.users.getAll().filter((user) => user.role === 'child');
    const balances = childUsers.map((user) => ({
      user,
      balance: 0, // You'd fetch the actual balance from your backend
      transactions: [], // You'd fetch transactions from your backend
    }));
    setUserBalances(balances);
  }, []);

  const handleAddFunds = (userId: string, amount: number) => {
    setUserBalances((prevBalances) =>
      prevBalances.map((balance) =>
        balance.user.id === userId
          ? {
              ...balance,
              balance: balance.balance + amount,
              transactions: [
                { id: Date.now().toString(), userId, amount, type: 'deposit', date: new Date() },
                ...balance.transactions,
              ],
            }
          : balance
      )
    );
  };

  const handleWithdrawFunds = (userId: string, amount: number) => {
    setUserBalances((prevBalances) =>
      prevBalances.map((balance) =>
        balance.user.id === userId
          ? {
              ...balance,
              balance: balance.balance - amount,
              transactions: [
                { id: Date.now().toString(), userId, amount, type: 'withdrawal', date: new Date() },
                ...balance.transactions,
              ],
            }
          : balance
      )
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Piggy Bank</h1>

      {/* User Balances Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {userBalances.map(({ user, balance }) => (
          <Card key={user.id}>
            <CardHeader className="flex flex-row items-center space-x-4">
              <IconComponent icon={user.iconName} className="w-12 h-12" />
              <CardTitle>{user.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold mb-4">${balance.toFixed(2)}</p>
              <div className="flex space-x-2">
                <Button
                  onClick={() => {
                    setSelectedUser(user.id);
                    setIsAddModalOpen(true);
                  }}
                >
                  Add Funds
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedUser(user.id);
                    setIsWithdrawModalOpen(true);
                  }}
                >
                  Withdraw Funds
                </Button>
              </div>
              <Button
                variant="link"
                onClick={() => {
                  setSelectedUser(user.id);
                  setIsTransactionsModalOpen(true);
                }}
                className="mt-2"
              >
                View Transactions
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedUser && (
        <>
          <AddFundsModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onAddFunds={(amount) => handleAddFunds(selectedUser, amount)}
          />
          <WithdrawFundsModal
            isOpen={isWithdrawModalOpen}
            onClose={() => setIsWithdrawModalOpen(false)}
            onWithdrawFunds={(amount) => handleWithdrawFunds(selectedUser, amount)}
            currentBalance={
              userBalances.find((balance) => balance.user.id === selectedUser)?.balance || 0
            }
          />
          <TransactionsModal
            isOpen={isTransactionsModalOpen}
            onClose={() => setIsTransactionsModalOpen(false)}
            transactions={
              userBalances.find((balance) => balance.user.id === selectedUser)?.transactions || []
            }
            userName={
              userBalances.find((balance) => balance.user.id === selectedUser)?.user.name || ''
            }
          />
        </>
      )}
    </div>
  );
}
