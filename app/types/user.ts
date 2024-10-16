export interface User {
  user_id: string;
  name: string;
  icon: string;
  soundurl: string;
  birthday: string;
  role: 'parent' | 'child';
}

export type CreateUserInput = Omit<User, 'user_id'>;
