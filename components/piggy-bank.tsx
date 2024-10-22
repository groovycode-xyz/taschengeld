'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AddFundsModal } from './add-funds-modal';
import { WithdrawFundsModal } from './withdraw-funds-modal';
import { PiggyBankAccount } from '@/app/types/piggyBankAccount';
import { PiggyBankTransaction } from '@/app/types/piggyBankTransaction';
import { formatCurrency } from '@/lib/utils';
import { PiggyBankIcon } from 'lucide-react';

export function PiggyBank() {
  const [account, setAccount] = useState<PiggyBankAccount | null>(null);
  const [transactions, setTransactions] = useState<PiggyBankTransaction[]>([]);
  const [isAddFundsModalOpen, setIsAddFundsModalOpen] = useState(false);
  const [isWithdrawFundsModalOpen, setIsWithdrawFundsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAccountData = useCallback(async () => {
    try {
      const response = await fetch('/api/piggy-bank');
      if (!response.ok) throw new Error('Failed to fetch account data');
      const data = await response.json();
      setAccount(data);
      setIsLoading(false);
    } catch (err) {
      setError('Error fetching account data');
      console.error(err);
      setIsLoading(false);
    }
  }, []);

  const fetchTransactions = useCallback(async () => {
    if (!account || !account.account_id) return;
    try {
      const response = await fetch(`/api/piggy-bank/transactions?accountId=${account.account_id}`);
      if (!response.ok) throw new Error('Failed to fetch transactions');
      const data = await response.json();
      setTransactions(data);
    } catch (err) {
      setError('Error fetching transactions');
      console.error(err);
    }
  }, [account]);

  useEffect(() => {
    fetchAccountData();
  }, [fetchAccountData]);

  useEffect(() => {
    if (account && account.account_id) {
      fetchTransactions();
    }
  }, [account, fetchTransactions]);

  const handleAddFunds = async (amount: number, comments: string, photo: string | null) => {
    if (!account) return;

    // Optimistically update the UI
    const newTransaction: PiggyBankTransaction = {
      transaction_id: Date.now(), // Temporary ID
      account_id: account.account_id,
      amount: amount.toString(),
      transaction_type: 'deposit',
      transaction_date: new Date().toISOString(),
      description: comments,
      photo: photo,
    };

    setTransactions((prevTransactions) => [newTransaction, ...prevTransactions]);
    setAccount((prevAccount) =>
      prevAccount
        ? { ...prevAccount, balance: (parseFloat(prevAccount.balance) + amount).toString() }
        : null
    );

    try {
      const response = await fetch('/api/piggy-bank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          account_id: account.account_id,
          amount,
          transaction_type: 'deposit',
          description: comments,
          photo,
        }),
      });
      if (!response.ok) throw new Error('Failed to add funds');

      // Refresh data from the server to ensure consistency
      await fetchAccountData();
      await fetchTransactions();
    } catch (err) {
      setError('Error adding funds');
      console.error(err);
      // Revert optimistic updates
      await fetchAccountData();
      await fetchTransactions();
    }
  };

  const handleWithdrawFunds = async (amount: number, comments: string, photo: string | null) => {
    if (!account) return;
    if (account.balance < amount) {
      setError('Insufficient balance');
      return;
    }

    // Optimistically update the UI
    const newTransaction: PiggyBankTransaction = {
      transaction_id: Date.now(), // Temporary ID
      account_id: account.account_id,
      amount: (-amount).toString(),
      transaction_type: 'withdrawal',
      transaction_date: new Date().toISOString(),
      description: comments,
      photo: photo,
    };

    setTransactions((prevTransactions) => [newTransaction, ...prevTransactions]);
    setAccount((prevAccount) =>
      prevAccount
        ? { ...prevAccount, balance: (parseFloat(prevAccount.balance) - amount).toString() }
        : null
    );

    try {
      const response = await fetch('/api/piggy-bank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          account_id: account.account_id,
          amount: -amount,
          transaction_type: 'withdrawal',
          description: comments,
          photo,
        }),
      });
      if (!response.ok) throw new Error('Failed to withdraw funds');

      // Refresh data from the server to ensure consistency
      await fetchAccountData();
      await fetchTransactions();
    } catch (err) {
      setError('Error withdrawing funds');
      console.error(err);
      // Revert optimistic updates
      await fetchAccountData();
      await fetchTransactions();
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!account) {
    return <div>No account found.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center">
          <PiggyBankIcon className="mr-3 h-10 w-10" />
          Piggy Bank
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{formatCurrency(parseFloat(account.balance))}</p>
          <div className="mt-4 space-x-2">
            <Button onClick={() => setIsAddFundsModalOpen(true)}>Add Funds</Button>
            <Button onClick={() => setIsWithdrawFundsModalOpen(true)}>Withdraw Funds</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p>No transactions found.</p>
          ) : (
            <ul className="space-y-2">
              {transactions.map((transaction) => (
                <li key={transaction.transaction_id} className="border-b pb-2">
                  <p className="font-semibold">
                    {transaction.transaction_type === 'deposit' ? 'Deposit' : 'Withdrawal'}:{' '}
                    {formatCurrency(parseFloat(transaction.amount))}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(transaction.transaction_date).toLocaleString()}
                  </p>
                  {transaction.description && <p>{transaction.description}</p>}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <AddFundsModal
        isOpen={isAddFundsModalOpen}
        onClose={() => setIsAddFundsModalOpen(false)}
        onAddFunds={handleAddFunds}
        userName={account.user_name || ''}
        userIcon={account.user_icon || ''}
      />

      <WithdrawFundsModal
        isOpen={isWithdrawFundsModalOpen}
        onClose={() => setIsWithdrawFundsModalOpen(false)}
        onWithdrawFunds={handleWithdrawFunds}
        balance={parseFloat(account.balance)}
        userName={account.user_name || ''}
        userIcon={account.user_icon || ''}
      />

      {error && <div className="text-red-500 mt-4">{error}</div>}
    </div>
  );
}
