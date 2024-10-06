export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'deposit' | 'withdrawal';
  date: Date;
  comments?: string;
  photo?: string | null;
}
