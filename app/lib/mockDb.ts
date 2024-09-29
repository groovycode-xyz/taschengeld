import { Task } from '@/app/types/task';

const tasks: Task[] = [
  {
    id: '1',
    title: 'Clean Room',
    description: 'Tidy up your bedroom',
    iconUrl: '/icons/clean-room.png',
    soundUrl: '/sounds/clean-room.mp3',
    payoutValue: 5,
    isActive: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  },
  // Add more mock tasks as needed
];

export const db = {
  tasks: {
    getAll: () => tasks,
    getById: (id: string) => tasks.find(task => task.id === id),
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
      const index = tasks.findIndex(task => task.id === id);
      if (index !== -1) {
        tasks[index] = { ...tasks[index], ...updatedTask, updatedAt: new Date() };
        return tasks[index];
      }
      return null;
    },
    delete: (id: string) => {
      const index = tasks.findIndex(task => task.id === id);
      if (index !== -1) {
        tasks.splice(index, 1);
        return true;
      }
      return false;
    },
  },
};