import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PiggyBankAccount } from '@/app/types/piggyBankAccount';
import { formatCurrency } from '@/lib/utils';
import { IconComponent } from './icon-component';
import { AddFundsModal } from './add-funds-modal';
import { WithdrawFundsModal } from './withdraw-funds-modal';
import { TransactionsModal } from './transactions-modal'; // You'll need to create this component

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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <IconComponent icon={account.user_icon || ''} className="mr-2 h-6 w-6" />
          {account.user_name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold mb-4">{formatCurrency(parseFloat(account.balance))}</p>
        {allAccounts.length > 1 && (
          <p className="text-sm text-gray-500 mb-2">{allAccounts.length} accounts</p>
        )}
        <div className="flex flex-col space-y-2">
          <Button onClick={() => setIsAddFundsModalOpen(true)}>Add Funds</Button>
          <Button onClick={() => setIsWithdrawFundsModalOpen(true)}>Withdraw Funds</Button>
          <Button onClick={() => setIsTransactionsModalOpen(true)}>Transactions</Button>
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
