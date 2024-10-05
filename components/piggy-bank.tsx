'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AddFundsModal } from './add-funds-modal';
import { WithdrawFundsModal } from './withdraw-funds-modal';
import { TransactionsModal } from './transactions-modal';
import { User } from '@/app/types/user';
import { mockDb } from '@/app/lib/mockDb';
import { useParentChildMode } from '@/hooks/useParentChildMode'; // Add this import

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
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isTransactionsModalOpen, setIsTransactionsModalOpen] = useState(false);
  const { isParentMode } = useParentChildMode(); // Add this line

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

  const handleAddFunds = (user: User) => {
    setSelectedUser(user);
    setIsAddModalOpen(true);
  };

  const handleWithdrawFunds = (user: User) => {
    setSelectedUser(user);
    setIsWithdrawModalOpen(true);
  };

  const handleViewTransactions = (userBalance: UserBalance) => {
    setSelectedUser(userBalance.user);
    setIsTransactionsModalOpen(true);
  };

  const handleAddFundsConfirm = (amount: number) => {
    if (selectedUser) {
      setUserBalances((prevBalances) =>
        prevBalances.map((balance) =>
          balance.user.id === selectedUser.id
            ? {
                ...balance,
                balance: balance.balance + amount,
                transactions: [
                  {
                    id: Date.now().toString(),
                    userId: selectedUser.id,
                    amount,
                    type: 'deposit',
                    date: new Date(),
                  },
                  ...balance.transactions,
                ],
              }
            : balance
        )
      );
      setIsAddModalOpen(false);
    }
  };

  const handleWithdrawFundsConfirm = (amount: number) => {
    if (selectedUser) {
      setUserBalances((prevBalances) =>
        prevBalances.map((balance) =>
          balance.user.id === selectedUser.id
            ? {
                ...balance,
                balance: balance.balance - amount,
                transactions: [
                  {
                    id: Date.now().toString(),
                    userId: selectedUser.id,
                    amount,
                    type: 'withdrawal',
                    date: new Date(),
                  },
                  ...balance.transactions,
                ],
              }
            : balance
        )
      );
      setIsWithdrawModalOpen(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Piggy Bank</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {userBalances.map((userBalance) => (
          <Card key={userBalance.user.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{userBalance.user.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-between">
              <div>
                <p className="text-2xl font-bold">${userBalance.balance.toFixed(2)}</p>
                <p className="text-sm text-gray-500">
                  {userBalance.transactions.length} transactions
                </p>
              </div>
              <div className="flex flex-col space-y-2 mt-4">
                {isParentMode && (
                  <>
                    <Button onClick={() => handleAddFunds(userBalance.user)}>Add Funds</Button>
                    <Button onClick={() => handleWithdrawFunds(userBalance.user)}>
                      Withdraw Funds
                    </Button>
                  </>
                )}
                <Button onClick={() => handleViewTransactions(userBalance)}>
                  View Transactions
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {selectedUser && (
        <>
          <AddFundsModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onAddFunds={handleAddFundsConfirm}
            user={selectedUser}
          />
          <WithdrawFundsModal
            isOpen={isWithdrawModalOpen}
            onClose={() => setIsWithdrawModalOpen(false)}
            onWithdrawFunds={handleWithdrawFundsConfirm}
            user={selectedUser}
            balance={userBalances.find((ub) => ub.user.id === selectedUser.id)?.balance || 0}
          />
        </>
      )}
      {selectedUser && (
        <TransactionsModal
          isOpen={isTransactionsModalOpen}
          onClose={() => setIsTransactionsModalOpen(false)}
          transactions={
            userBalances.find((ub) => ub.user.id === selectedUser.id)?.transactions || []
          }
          user={selectedUser}
        />
      )}
    </div>
  );
}
