export enum TransactionType {
  Deposit = 'deposit',
  Withdrawal = 'withdrawal',
}

export interface Transaction {
  transaction_id: number;
  account_id: number;
  amount: number;
  transaction_type: TransactionType;
  transaction_date?: Date;
  description?: string;
  photo?: string;
  completed_task_id?: number;
}
