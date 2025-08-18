export interface SavingsGoal {
  goal_id: number;
  user_id: number;
  title: string;
  description?: string | null;
  icon_name: string;
  target_amount: string;
  current_balance: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  user_name: string;
  user_icon: string;
  progress_percentage: number;
}

export interface SavingsGoalInput {
  user_id: number;
  title: string;
  description?: string | null;
  icon_name: string;
  target_amount: number;
}

export interface SavingsGoalUpdate {
  title?: string;
  description?: string | null;
  icon_name?: string;
  target_amount?: number;
  is_active?: boolean;
}