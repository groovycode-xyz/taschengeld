export interface Task {
  id: string;
  taskId: string; // Add this line
  title: string;
  description: string;
  iconName: string;
  soundUrl: string | null;
  payoutValue: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type CompletedTask = Task & {
  userId: string;
  userName: string;
  userIcon: string;
  completedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
};
