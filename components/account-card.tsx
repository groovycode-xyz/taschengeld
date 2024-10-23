import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PiggyBankAccount } from '@/app/types/piggyBankAccount';
import { formatCurrency } from '@/lib/utils';
import { IconComponent } from './icon-component';
import { AddFundsModal } from './add-funds-modal';
import { WithdrawFundsModal } from './withdraw-funds-modal';
import { TransactionsModal } from './transactions-modal';

interface AccountCardProps {
  account: PiggyBankAccount;
  onUpdate: () => void;
  allAccounts: PiggyBankAccount[];
}

export function AccountCard({ account, onUpdate, allAccounts }: AccountCardProps) {
  const [isAddFundsModalOpen, setIsAddFundsModalOpen] = useState(false);
  const [isWithdrawFundsModalOpen, setIsWithdrawFundsModalOpen] = useState(false);
  const [isTransactionsModalOpen, setIsTransactionsModalOpen] = useState(false);

  const handleAddFunds = async (amount: number, comments: string, photo: string | null) => {
    try {
      const response = await fetch('/api/piggy-bank', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          account_id: account.account_id,
          amount,
          transaction_type: 'deposit',
          description: comments,
          photo,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add funds');
      }

      onUpdate();
    } catch (error) {
      console.error('Error adding funds:', error);
      // Handle error (e.g., show error message to user)
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
          account_id: account.account_id,
          amount: -amount, // Negative amount for withdrawal
          transaction_type: 'withdrawal',
          description: comments,
          photo,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to withdraw funds');
      }

      onUpdate();
    } catch (error) {
      console.error('Error withdrawing funds:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <Card className="flex flex-col items-center text-center">
      <CardHeader className="flex flex-col items-center">
        <IconComponent icon={account.user_icon || ''} className="w-24 h-24 mb-2" />
        <CardTitle>{account.user_name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center w-full">
        <p className="text-2xl font-bold mb-4">{formatCurrency(parseFloat(account.balance))}</p>
        {allAccounts.length > 1 && (
          <p className="text-sm text-gray-500 mb-2">{allAccounts.length} accounts</p>
        )}
        <div className="flex flex-col space-y-2 w-full">
          <Button
            onClick={() => setIsAddFundsModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Add Funds
          </Button>
          <Button
            onClick={() => setIsWithdrawFundsModalOpen(true)}
            className="bg-rose-600 hover:bg-rose-700 text-white"
          >
            Withdraw Funds
          </Button>
          <Button
            onClick={() => setIsTransactionsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Transactions
          </Button>
        </div>
      </CardContent>

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

      <TransactionsModal
        isOpen={isTransactionsModalOpen}
        onClose={() => setIsTransactionsModalOpen(false)}
        accounts={allAccounts}
      />
    </Card>
  );
}
