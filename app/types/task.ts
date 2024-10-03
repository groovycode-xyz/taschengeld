export type Task = {
  taskId: number;
  title: string;
  description: string;
  icon: string;
  sound: string | null;
  payoutValue: number;
  activeStatus: boolean;
  createdAt: Date;
};