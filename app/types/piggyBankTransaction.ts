export enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
}

export interface PiggyBankTransaction {
  transaction_id: number;
  account_id: number;
  amount: string;
  transaction_type: TransactionType;
  transaction_date: string;
  description: string;
  photo: string | null;
  completed_task_id: number | null;
  task_title?: string; // Optional since it comes from JOIN
  payout_value?: number; // Optional since it comes from JOIN
}
