export type Task = {
  id: string;
  title: string;
  description: string;
  iconName: string;
  soundUrl: string | null;
  payoutValue: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  taskId: string; // {{ Made 'taskId' required }}
};

export type CompletedTask = Task & {
  userId: string;
  userName: string;
  userIcon: string;
  completedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
};
