export interface CreateCompletedTaskInput {
  user_id: number;
  task_id: number;
  comment?: string;
  attachment?: string;
}

export interface CompletedTask {
  c_task_id: number;
  task_id: string;
  task_title: string;
  icon_name: string;
  sound_url: string | null;
  user_id: number;
  user_name: string;
  user_icon: string;
  created_at: Date;
  payment_status: 'Unpaid' | 'Approved' | 'Rejected';
  payout_value: string;
  comment?: string;
  attachment?: string;
}
