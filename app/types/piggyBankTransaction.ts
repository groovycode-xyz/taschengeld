export type TransactionType = 'deposit' | 'withdrawal' | 'payday';

export interface PiggyBankTransaction {
  transaction_id: number;
  account_id: number;
  amount: number;
  transaction_type: TransactionType;
  transaction_date: Date | null;
  description: string | null;
  photo: string | null;
  completed_task_id?: number | null;
  task_title?: string; // Optional since it comes from JOIN
  payout_value?: number; // Optional since it comes from JOIN
}

export interface CreateTransactionInput {
  user_id: number;
  amount: number;
  transaction_type: TransactionType;
  description?: string | null;
  photo?: string | null;
  completed_task_id?: number | null;
}
