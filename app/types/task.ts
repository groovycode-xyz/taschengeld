export interface Task {
  task_id: string;
  title: string;
  description: string;
  icon_name: string;
  sound_url: string | null;
  payout_value: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export type CompletedTask = Task & {
  userId: string;
  userName: string;
  userIcon: string;
  completedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
};
