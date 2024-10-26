export interface PiggyBankAccount {
  account_id: number;
  account_number: string;
  balance: string;
}

export interface PiggyBankTransaction {
  transaction_id: number;
  amount: string;
  description: string;
  transaction_date: string;
  transaction_type: 'deposit' | 'withdrawal';
  task_title?: string;
}

export interface PiggyBankUser {
  user_id: number;
  name: string;
  icon: string;
  account: PiggyBankAccount;
  recent_transactions: PiggyBankTransaction[];
}
