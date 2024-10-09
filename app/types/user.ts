export interface User {
  id: string;
  name: string;
  role: 'parent' | 'child';
  sound: string | null;
  soundUrl: string | null;
  birthday: string;
  icon: string;
}

export type CreateUserInput = Omit<User, 'id'>;
