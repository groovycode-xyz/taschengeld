export interface Task {
  id: string;
  title: string;
  description: string;
  iconUrl: string;
  soundUrl: string;
  payoutValue: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}