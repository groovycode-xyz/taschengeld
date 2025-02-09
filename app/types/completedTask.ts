export enum PaymentStatus {
  Paid = 'Paid',
  Unpaid = 'Unpaid',
}

export interface CreateCompletedTaskInput {
  user_id: number;
  task_id: number;
  comment?: string;
  attachment?: string;
}

export interface CompletedTask {
  c_task_id: number;
  user_id: number;
  task_id: number;
  description?: string;
  payout_value?: number;
  created_at?: Date;
  comment?: string;
  attachment?: string;
  payment_status: PaymentStatus;
}

export interface FullTaskDetails extends CompletedTask {
  piggybank_account_id: number;
}
