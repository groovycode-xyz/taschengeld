export interface Task {
  task_id: string;
  title: string;
  description?: string | null;
  icon_name?: string | null;
  sound_url?: string | null;
  payout_value: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}
