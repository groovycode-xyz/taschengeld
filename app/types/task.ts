export interface Task {
  id: string;
  title: string;
  description: string;
  iconName: string;
  soundUrl: string;
  payoutValue: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}