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
  description: string | null;
  payout_value: number | null;
  created_at: Date;
  comment: string | null;
  attachment: string | null;
  payment_status: PaymentStatus;
  // Fields from joins
  task_title?: string;
  task_description?: string;
  icon_name?: string;
  user_name?: string;
  user_icon?: string;
  user_birthday?: string;
}

export interface FullTaskDetails extends CompletedTask {
  piggybank_account_id: number;
}
