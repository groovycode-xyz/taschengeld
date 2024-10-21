export interface CreateCompletedTaskInput {
  user_id: number;
  task_id: number;
  comment?: string;
  attachment?: string;
}

export interface CompletedTask extends CreateCompletedTaskInput {
  c_task_id: number;
  completed_at: Date;
  payment_status: string;
}
