import { Transaction } from '@/app/types/transaction';
import { User } from '@/app/types/user';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface TransactionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  user: User;
}

export function TransactionsModal({ isOpen, onClose, transactions, user }: TransactionsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transactions for {user.name}</DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="mb-4 p-4 border rounded">
              <p>
                {transaction.type === 'deposit' ? 'Added' : 'Withdrew'} $
                {transaction.amount.toFixed(2)}
              </p>
              <p>Date: {transaction.date.toLocaleDateString()}</p>
              {transaction.comments && <p>Comments: {transaction.comments}</p>}
              {transaction.photo && (
                <img
                  src={transaction.photo}
                  alt="Transaction"
                  className="mt-2 max-w-full h-32 object-cover"
                />
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
