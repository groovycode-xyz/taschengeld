export interface User {
  user_id: number;
  name: string;
  icon: string;
  soundurl: string | null;
  birthday: Date;
  role: 'parent' | 'child';
  piggybank_account_id: number | null;
  created_at: Date;
  sound: string | null;
}

export interface Task {
  task_id: number;
  title: string;
  description: string | null;
  icon_name: string | null;
  sound_url: string | null;
  payout_value: string;  // numeric(15,2)
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CompletedTask {
  c_task_id: number;
  user_id: number;
  task_id: number;
  description: string | null;
  payout_value: string;  // numeric(15,2)
  created_at: Date;
  comment: string | null;
  attachment: string | null;
  payment_status: 'Paid' | 'Unpaid';
}

export interface PiggybankAccount {
  account_id: number;
  user_id: number;
  account_number: string;
  balance: string;  // numeric(15,2)
  created_at: Date;
}

export interface PiggybankTransaction {
  transaction_id: number;
  account_id: number;
  amount: string;  // numeric(15,2)
  transaction_type: 'deposit' | 'withdrawal';
  transaction_date: Date;
  description: string | null;
  photo: string | null;
  completed_task_id: number | null;
}

export interface AppSetting {
  setting_id: number;
  setting_key: string;
  setting_value: string | null;
  created_at: Date;
  updated_at: Date;
}

// Backup interfaces that match our standardized schema
export interface BackupData {
  timestamp: string;
  schema_version: string;
  type: 'tasks' | 'piggybank' | 'all';
  data: {
    app_settings?: AppSetting[];
    users?: User[];
    tasks?: {
      tasks: Task[];
      completed_tasks: CompletedTask[];
    };
    piggybank?: {
      accounts: PiggybankAccount[];
      transactions: PiggybankTransaction[];
    };
    all?: {
      users: User[];
      tasks: Task[];
      completed_tasks: CompletedTask[];
      accounts: PiggybankAccount[];
      transactions: PiggybankTransaction[];
      app_settings: AppSetting[];
    };
  };
} 