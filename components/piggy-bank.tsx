'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardTitle } from 'components/ui/card';
import { Button } from 'components/ui/button';
import { AddFundsModal } from './add-funds-modal';
import { WithdrawFundsModal } from './withdraw-funds-modal';
import { TransactionsModal } from './transactions-modal';
import { User } from 'app/types/user';
import { mockDb } from 'app/lib/mockDb';
import { IconComponent } from './icon-component';
import { PiggyBankIcon } from 'lucide-react';

interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'deposit' | 'withdrawal';
  date: Date;
  comments?: string;
  photo?: string | null;
  balance: number;
}

interface UserBalance {
  user: User;
  balance: number;
  transactions: Transaction[];
}

export function PiggyBank() {
  const [userBalances, setUserBalances] = useState<UserBalance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isTransactionsModalOpen, setIsTransactionsModalOpen] = useState(false);

  useEffect(() => {
    const loadUserBalances = () => {
      const childUsers = mockDb.users.getAll().filter((user) => user.role === 'child');
      const storedBalances = localStorage.getItem('userBalances');
      if (storedBalances) {
        const parsedBalances = JSON.parse(storedBalances);
        // Check if stored balances match current child users
        if (parsedBalances.length === childUsers.length) {
          setUserBalances(parsedBalances);
        } else {
          // If not, create new balances for all child users
          const initialBalances = childUsers.map((user) => ({
            user,
            balance: 0,
            transactions: [],
          }));
          setUserBalances(initialBalances);
        }
      } else {
        // If no stored balances, create new balances for all child users
        const initialBalances = childUsers.map((user) => ({
          user,
          balance: 0,
          transactions: [],
        }));
        setUserBalances(initialBalances);
      }
      setIsLoading(false);
    };

    loadUserBalances();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('userBalances', JSON.stringify(userBalances));
    }
  }, [userBalances, isLoading]);

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

  const handleAddFundsConfirm = (amount: number, comments: string, photo: string | null) => {
    if (selectedUser) {
      const userBalance = userBalances.find((ub) => ub.user.id === selectedUser.id);
      const newBalance = (userBalance?.balance || 0) + amount;
      const newTransaction = {
        id: Date.now().toString(),
        userId: selectedUser.id,
        type: 'deposit' as const,
        amount,
        date: new Date(),
        comments,
        photo,
        balance: newBalance,
      };

      setUserBalances((prevBalances) =>
        prevBalances.map((ub) =>
          ub.user.id === selectedUser.id
            ? {
                ...ub,
                balance: newBalance,
                transactions: [newTransaction, ...ub.transactions],
              }
            : ub
        )
      );
    }
    setIsAddModalOpen(false);
  };

  const handleWithdrawFundsConfirm = (amount: number, comments: string, photo: string | null) => {
    if (selectedUser) {
      const userBalance = userBalances.find((ub) => ub.user.id === selectedUser.id);
      const newBalance = (userBalance?.balance || 0) - amount;
      const newTransaction = {
        id: Date.now().toString(),
        userId: selectedUser.id,
        type: 'withdrawal' as const,
        amount,
        date: new Date(),
        comments,
        photo,
        balance: newBalance,
      };

      setUserBalances((prevBalances) =>
        prevBalances.map((ub) =>
          ub.user.id === selectedUser.id
            ? {
                ...ub,
                balance: newBalance,
                transactions: [newTransaction, ...ub.transactions],
              }
            : ub
        )
      );
    }
    setIsWithdrawModalOpen(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (userBalances.length === 0) {
    return (
      <div>
        No child users found. Please add child users in the User Management interface to use the
        Piggy Bank feature.
      </div>
    );
  }

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
              <p className="text-3xl font-bold text-blue-600">{userBalance.balance.toFixed(2)}</p>
            </div>
            <div className="w-full h-px bg-gray-200 mb-4"></div>{' '}
            {/* Add this line for the separator */}
            <div className="w-full space-y-2">
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
              <Button onClick={() => handleViewTransactions(userBalance)} className="w-full">
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
            userIcon={selectedUser.iconName}
          />
          <WithdrawFundsModal
            isOpen={isWithdrawModalOpen}
            onClose={() => setIsWithdrawModalOpen(false)}
            onWithdrawFunds={handleWithdrawFundsConfirm}
            balance={userBalances.find((ub) => ub.user.id === selectedUser?.id)?.balance || 0}
            userName={selectedUser.name}
            userIcon={selectedUser.iconName}
          />
          <TransactionsModal
            isOpen={isTransactionsModalOpen}
            onClose={() => setIsTransactionsModalOpen(false)}
            transactions={
              userBalances.find((ub) => ub.user.id === selectedUser.id)?.transactions || []
            }
            user={selectedUser} // Pass the entire user object
          />
        </>
      )}
    </div>
  );
}
