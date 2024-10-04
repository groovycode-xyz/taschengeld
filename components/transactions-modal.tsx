import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'deposit' | 'withdrawal';
  date: Date;
}

interface TransactionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  userName: string;
}

export function TransactionsModal({
  isOpen,
  onClose,
  transactions,
  userName,
}: TransactionsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{userName}&apos;s Transactions</DialogTitle>
        </DialogHeader>
        <div className="mt-4 max-h-96 overflow-y-auto">
          {transactions.length === 0 ? (
            <p>No transactions yet.</p>
          ) : (
            <ul className="space-y-2">
              {transactions.map((transaction) => (
                <li key={transaction.id} className="flex justify-between items-center">
                  <span>{transaction.type === 'deposit' ? 'Deposit' : 'Withdrawal'}</span>
                  <span
                    className={transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'}
                  >
                    ${transaction.amount.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(transaction.date).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
