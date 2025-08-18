export interface SavingsGoalTransaction {
  transaction_id: number;
  goal_id: number;
  amount: string;
  transaction_type: 'contribute' | 'withdraw' | 'purchase';
  transaction_date: string;
  description?: string;
  from_piggybank: boolean;
  goal_title: string;
}

export interface SavingsGoalTransactionInput {
  goal_id: number;
  amount: number;
  transaction_type: 'contribute' | 'withdraw' | 'purchase';
  description?: string;
  from_piggybank?: boolean;
}