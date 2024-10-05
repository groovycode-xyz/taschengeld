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
import Image from 'next/image';
import { IconComponent } from './icon-component'; // Add this import
import { PiggyBankIcon } from 'lucide-react'; // Add this import

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center">
          <PiggyBankIcon className="mr-3 h-10 w-10" /> {/* Increased size here */}
          Piggy Bank
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {userBalances.map((userBalance) => (
          <Card key={userBalance.user.id} className="flex flex-col items-center p-4">
            <div className="w-20 h-20 mb-2">
              <IconComponent icon={userBalance.user.iconName} className="w-full h-full" />
            </div>
            <CardTitle className="text-xl mb-3">{userBalance.user.name}</CardTitle>
            <div className="bg-blue-100 rounded-lg shadow-md p-3 mb-4 w-full text-center">
              <p className="text-3xl font-bold text-blue-600">
                ${userBalance.balance.toFixed(2)}
              </p>
            </div>
            <div className="w-full h-px bg-gray-200 mb-4"></div> {/* Add this line for the separator */}
            <div className="w-full space-y-2">
              {isParentMode && (
                <>
                  <Button
                    onClick={() => handleAddFunds(userBalance.user)}
                    className="w-full bg-green-500 hover:bg-green-600 text-white"
                  >
                    Add Funds
                  </Button>
                  <Button
                    onClick={() => handleWithdrawFunds(userBalance.user)}
                    className="w-full bg-red-500 hover:bg-red-600 text-white"
                  >
                    Withdraw Funds
                  </Button>
                </>
              )}
              <Button
                onClick={() => handleViewTransactions(userBalance)}
                className="w-full"
              >
                View Transactions
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {selectedUser && (
        <>
          <AddFundsModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onAddFunds={handleAddFundsConfirm}
            userName={selectedUser.name}
          />
          <WithdrawFundsModal
            isOpen={isWithdrawModalOpen}
            onClose={() => setIsWithdrawModalOpen(false)}
            onWithdrawFunds={handleWithdrawFundsConfirm}
            balance={userBalances.find((ub) => ub.user.id === selectedUser.id)?.balance || 0}
            userName={selectedUser.name}
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
