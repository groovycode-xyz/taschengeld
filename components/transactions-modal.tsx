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
import { IconComponent } from './icon-component';

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

  const getTransactionDescription = (transaction: PiggyBankTransaction) => {
    if (transaction.completed_task_id && transaction.task_title) {
      return `Payment for task: ${transaction.task_title}`;
    }
    return transaction.description || 'No description available';
  };

  const selectedAccount = accounts.find((account) => account.account_id === selectedAccountId);

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-h-[80vh] flex flex-col p-6">
        <DialogHeader className="mb-4">
          <div className="flex items-center gap-2">
            {selectedAccount && (
              <IconComponent icon={selectedAccount.user_icon || ''} className="h-6 w-6" />
            )}
            <div className="flex flex-col">
              <DialogTitle>Transaction History</DialogTitle>
              {selectedAccount && (
                <p className="text-sm text-gray-500 mt-1">{selectedAccount.user_name}</p>
              )}
            </div>
          </div>
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
                  <div className="flex items-center">
                    <IconComponent icon={account.user_icon || ''} className="mr-2 h-4 w-4" />
                    {account.account_number} - {formatCurrency(parseFloat(account.balance))}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <ScrollArea className="h-[50vh] w-full rounded-md">
          <div className="space-y-4 pr-4">
            {isLoading ? (
              <p>Loading transactions...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : transactions.length === 0 ? (
              <p>No transactions found</p>
            ) : (
              transactions.map((transaction) => (
                <div
                  key={transaction.transaction_id}
                  className={`border p-4 rounded-lg space-y-2 transition-colors ${
                    transaction.transaction_type === 'deposit'
                      ? 'bg-green-50 border-green-200 hover:bg-green-100'
                      : 'bg-red-50 border-red-200 hover:bg-red-100'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div
                        className={`p-2 rounded-full ${
                          transaction.transaction_type === 'deposit' ? 'bg-green-100' : 'bg-red-100'
                        }`}
                      >
                        {transaction.transaction_type === 'deposit' ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-green-600"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 3a1 1 0 00-.707.293l-4 4a1 1 0 101.414 1.414L10 5.414l3.293 3.293a1 1 0 001.414-1.414l-4-4A1 1 0 0010 3z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-red-600"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 17a1 1 0 00.707-.293l4-4a1 1 0 00-1.414-1.414L10 14.586l-3.293-3.293a1 1 0 00-1.414 1.414l4 4A1 1 0 0010 17z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      <span className="font-medium">
                        {transaction.transaction_type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                      </span>
                    </div>
                    <span
                      className={`text-lg font-semibold ${
                        transaction.transaction_type === 'deposit'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {transaction.transaction_type === 'deposit' ? '+' : '-'}
                      {formatCurrency(Math.abs(parseFloat(transaction.amount)))}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 font-medium">
                    {getTransactionDescription(transaction)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(transaction.transaction_date).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
