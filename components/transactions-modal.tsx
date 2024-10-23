import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PiggyBankTransaction } from '@/app/types/piggyBankTransaction';
import { PiggyBankAccount } from '@/app/types/piggyBankAccount';
import { formatCurrency } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TransactionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: PiggyBankAccount[];
}

export function TransactionsModal({ isOpen, onClose, accounts }: TransactionsModalProps) {
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<PiggyBankTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && accounts.length > 0 && !selectedAccountId) {
      setSelectedAccountId(accounts[0].account_id);
    }
  }, [isOpen, accounts, selectedAccountId]);

  useEffect(() => {
    if (isOpen && selectedAccountId) {
      fetchTransactions(selectedAccountId);
    }
  }, [isOpen, selectedAccountId]);

  const fetchTransactions = async (accountId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/piggy-bank/transactions?accountId=${accountId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      const data = await response.json();
      setTransactions(data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to load transactions');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedAccount = accounts.find((account) => account.account_id === selectedAccountId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Transactions for {selectedAccount?.user_name}</DialogTitle>
        </DialogHeader>
        {accounts.length > 1 && (
          <Select
            value={selectedAccountId?.toString()}
            onValueChange={(value) => setSelectedAccountId(Number(value))}
          >
            <SelectTrigger className="w-[200px] mb-4">
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.account_id} value={account.account_id.toString()}>
                  {account.account_number} - {formatCurrency(parseFloat(account.balance))}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <ScrollArea className="flex-grow overflow-auto">
          <div className="pr-4 space-y-4">
            {isLoading ? (
              <p>Loading transactions...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : transactions.length === 0 ? (
              <p>No transactions found for this account.</p>
            ) : (
              <ul className="space-y-4">
                {transactions.map((transaction) => (
                  <li key={transaction.transaction_id} className="border-b pb-4">
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
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
