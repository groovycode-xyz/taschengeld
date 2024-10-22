export interface PiggyBankTransaction {
  transaction_id: number;
  account_id: number;
  amount: string;
  transaction_type: 'deposit' | 'withdrawal';
  transaction_date: string;
  description: string;
  photo: string | null;
}
