import { Task } from '@/types/task';
import { Transaction } from '@/app/types/transaction';

const tasks: Task[] = [
  {
    id: '1',
    title: 'Clean Cat Litter',
    description: "Clean Valentina's litter box",
    iconName: 'broom',
    soundUrl: '/public/sounds/tasks/meow1.mp3',
    payoutValue: 5.0,
    isActive: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  },
  {
    id: '2',
    title: 'Feed Rabbits',
    description: 'Feed those hungry critters!',
    iconName: 'rabbit',
    soundUrl: '/public/sounds/tasks/beep-beep1.mp3',
    payoutValue: 5.0,
    isActive: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  },
  {
    id: '3',
    title: 'Empty Dishwasher',
    description: 'Empty the dishwasher',
    iconName: 'glass-water',
    soundUrl: '/public/sounds/tasks/beep-beep1.mp3',
    payoutValue: 5.0,
    isActive: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  },
  {
    id: '4',
    title: 'Vacuum',
    description: 'Vacuum the house',
    iconName: 'slack',
    soundUrl: '/public/sounds/tasks/power-up1.mp3',
    payoutValue: 5.0,
    isActive: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  },
  // Add more mock tasks as needed
];

export const db = {
  tasks: {
    getAll: () => tasks,
    getById: (id: string) => tasks.find((task) => task.id === id),
    create: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
      const newTask: Task = {
        ...task,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      tasks.push(newTask);
      return newTask;
    },
    update: (id: string, updatedTask: Partial<Task>) => {
      const index = tasks.findIndex((task) => task.id === id);
      if (index !== -1) {
        tasks[index] = { ...tasks[index], ...updatedTask, updatedAt: new Date() };
        return tasks[index];
      }
      return null;
    },
    delete: (id: string) => {
      const index = tasks.findIndex((task) => task.id === id);
      if (index !== -1) {
        tasks.splice(index, 1);
        return true;
      }
      return false;
    },
  },
};

export const mockDb = {
  users: {
    getAll: () => [
      {
        id: '1',
        name: 'James',
        sound: null,
        birthday: '1971-11-03',
        role: 'parent' as const,
        iconName: 'biceps-flexed',
        soundUrl: '/tgeld/public/sounds/users/woohoo1.mp3',
      },
      {
        id: '2',
        name: 'Rebekka',
        sound: null,
        birthday: '1985-10-12',
        role: 'parent' as const,
        iconName: 'flower',
        soundUrl: '/tgeld/public/sounds/users/harp.mp3',
      },
      {
        id: '3',
        name: 'Eliana',
        sound: null,
        birthday: '2015-03-26',
        role: 'child' as const,
        iconName: 'cat',
        soundUrl: '/tgeld/public/sounds/users/cat1.mp3',
      },
      {
        id: '4',
        name: 'Ariel',
        sound: null,
        birthday: '2016-12-01',
        role: 'child' as const,
        iconName: 'squirrel',
        soundUrl: '/tgeld/public/sounds/users/laugh1.mp3',
      },
      {
        id: '5',
        name: 'Valentina',
        sound: null,
        birthday: '2010-03-03',
        role: 'child' as const,
        iconName: 'cat',
        soundUrl: '/tgeld/public/sounds/users/laugh1.mp3',
      },
    ],
  },

  completedTasks: {
    getAll: () => [
      {
        c_task_id: '1',
        user_id: '3', // Eliana
        task_id: '1',
        title: 'Clean Cat Litter',
        payout_value: 5.0,
        created_at: new Date('2023-03-15T14:30:00'),
        comment: 'Great job!',
        attachment: null,
        payment_status: 'Unpaid',
      },
      {
        c_task_id: '2',
        user_id: '4', // Ariel
        task_id: '2',
        title: 'Feed Rabbits',
        payout_value: 5.0,
        created_at: new Date('2023-03-16T09:45:00'),
        comment: 'Well done!',
        attachment: null,
        payment_status: 'Unpaid',
      },
      {
        c_task_id: '3',
        user_id: '3', // Eliana
        task_id: '3',
        title: 'Empty Dishwasher',
        payout_value: 5.0,
        created_at: new Date('2023-03-17T16:20:00'),
        comment: 'Excellent work!',
        attachment: null,
        payment_status: 'Unpaid',
      },
    ],
    getUnpaidByUserId: (userId: string) =>
      mockDb.completedTasks
        .getAll()
        .filter((task) => task.user_id === userId && task.payment_status === 'Unpaid'),
    updatePaymentStatus: (c_task_id: string, status: 'Approved' | 'Reject') => {
      const task = mockDb.completedTasks.getAll().find((t) => t.c_task_id === c_task_id);
      if (task) {
        task.payment_status = status;
        return true;
      }
      return false;
    },
  },

  piggyBankAccounts: {
    getAll: () => [
      {
        account_id: '1',
        user_id: '3', // Eliana
        account_number: 'PB001',
        balance: 50.0,
        created_at: new Date('2023-01-01'),
      },
      {
        account_id: '2',
        user_id: '4', // Ariel
        account_number: 'PB002',
        balance: 35.5,
        created_at: new Date('2023-01-01'),
      },
    ],
    getByUserId: (userId: string) =>
      mockDb.piggyBankAccounts.getAll().find((account) => account.user_id === userId),
    updateBalance: (userId: string, amount: number) => {
      const account = mockDb.piggyBankAccounts.getByUserId(userId);
      if (account) {
        account.balance += amount;
        return true;
      }
      return false;
    },
  },

  piggyBankTransactions: {
    getAll: () => [
      {
        id: '1',
        userId: '3', // Eliana
        amount: 5.0,
        type: 'deposit',
        date: new Date('2023-03-15T14:35:00'),
        comments: 'Clean Cat Litter',
        photo: null,
      },
      {
        transaction_id: '2',
        account_id: '2',
        transaction_date: new Date('2023-03-16T09:50:00'),
        title: 'Feed Rabbits',
        amount: 5.0,
        transaction_type: 'Credit',
      },
    ],
    addTransaction: (transaction: Omit<Transaction, 'id'>) => {
      const newTransaction: Transaction = {
        ...transaction,
        id: (mockDb.piggyBankTransactions.getAll().length + 1).toString(),
      };
      mockDb.piggyBankTransactions.getAll().push(newTransaction);
      return newTransaction;
    },
  },
};

// Add these type definitions at the end of the file
type PiggyBankTransaction = {
  transaction_id: string;
  account_id: string;
  transaction_date: Date;
  title: string;
  amount: number;
  transaction_type: 'Credit' | 'Debit';
};

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  date: Date;
  comments?: string;
  photo?: string | null;
}

const transactions: Transaction[] = [
  {
    id: '1',
    type: 'deposit',
    amount: 10,
    date: new Date('2024-03-01'),
    comments: 'Birthday money',
    photo: null,
  },
  // ... (add more mock transactions as needed)
];

// At the end of the file, add this export:
export const getMockDb = () => mockDb;
