import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { User } from '@/app/types/user';

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
  user: User;
}

export function TransactionsModal({ isOpen, onClose, transactions, user }: TransactionsModalProps) {
  let balance = 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Transactions for {user.name}</DialogTitle>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => {
              if (transaction.type === 'deposit') {
                balance += transaction.amount;
              } else {
                balance -= transaction.amount;
              }
              return (
                <TableRow key={transaction.id}>
                  <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                  <TableCell className="capitalize">{transaction.type}</TableCell>
                  <TableCell
                    className={`text-right ${
                      transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">{balance.toFixed(2)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}
