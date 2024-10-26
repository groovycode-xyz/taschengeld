export interface PiggyBankUser {
  user_id: number;
  name: string;
  icon: string;
  account: {
    account_id: number;
    account_number: string;
    balance: string;
  };
  recent_transactions: Array<{
    transaction_id: number;
    amount: string;
    description: string;
    transaction_date: string;
    transaction_type: 'deposit' | 'withdrawal';
    task_title?: string;
  }>;
}
