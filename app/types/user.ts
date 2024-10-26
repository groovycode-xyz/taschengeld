export interface User {
  user_id: number;
  name: string;
  icon: string;
  soundurl?: string;
  birthday: string;
  role: 'parent' | 'child';
}

export interface CreateUserInput {
  name: string;
  icon: string;
  soundurl?: string;
  birthday: string;
  role: 'parent' | 'child';
}
