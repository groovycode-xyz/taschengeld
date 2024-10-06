import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { IconComponent } from './icon-component'; // Add this import
import { User } from '@/app/types/user';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  date: Date;
  comments?: string;
  photo?: string | null;
}

interface TransactionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  user: User; // Change this to accept the entire User object
}

export function TransactionsModal({ isOpen, onClose, transactions, user }: TransactionsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            Transactions for {user.name}{' '}
            <IconComponent icon={user.iconName} className="ml-2 h-6 w-6" />
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[60vh]">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="mb-4 p-4 border rounded-lg">
              <div className="flex justify-between items-center">
                <span
                  className={`font-bold ${
                    transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {transaction.type === 'deposit' ? '+' : '-'}
                  {transaction.amount.toFixed(2)}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(transaction.date).toLocaleDateString()}
                </span>
              </div>
              {transaction.comments && (
                <p className="mt-2 text-sm text-gray-600">{transaction.comments}</p>
              )}
              {transaction.photo && (
                <img
                  src={transaction.photo}
                  alt="Transaction"
                  className="mt-2 max-w-full h-32 object-cover rounded"
                />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
