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
  created_at: string;
  comment: string | null;
  attachment: string | null;
  payment_status: string;
  user_name: string;
  task_title: string;
  icon_name: string;
  user_icon: string;
}
