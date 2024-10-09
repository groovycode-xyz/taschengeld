import { Task } from '@/types/task';
import { User } from '@/app/types/user';

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Clean Room',
    description: 'Tidy up and organize your bedroom',
    iconName: 'broom',
    soundUrl: '/sounds/clean.mp3',
    payoutValue: 5,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'Do Homework',
    description: 'Complete all assigned homework',
    iconName: 'book',
    soundUrl: '/sounds/homework.mp3',
    payoutValue: 3,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    title: 'Walk Dog',
    description: 'Take the dog for a 30-minute walk',
    iconName: 'paw',
    soundUrl: '/sounds/dog.mp3',
    payoutValue: 4,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'James',
    sound: null,
    birthday: '1971-11-03',
    role: 'parent',
    icon: 'user-icon',
    soundUrl: null,
  },
  {
    id: '2',
    name: 'Rebekka',
    sound: null,
    birthday: '1985-10-12',
    role: 'parent',
    icon: 'user-icon',
    soundUrl: null,
  },
  {
    id: '3',
    name: 'Eliana',
    sound: null,
    birthday: '2015-03-26',
    role: 'child',
    icon: 'user-icon',
    soundUrl: null,
  },
  {
    id: '4',
    name: 'Ariel',
    sound: null,
    birthday: '2016-12-01',
    role: 'child',
    icon: 'user-icon',
    soundUrl: null,
  },
];
