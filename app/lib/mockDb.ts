import { Task } from '@/types/task';

const tasks: Task[] = [
  {
    id: '1',
    title: 'Clean Room',
    description: 'Tidy up your bedroom',
    iconName: 'broom',
    soundUrl: '/sounds/clean-room.mp3',
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
    ],
  },
};
