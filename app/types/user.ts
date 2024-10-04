export interface User {
  id: string;
  name: string;
  role: 'parent' | 'child';
  sound: string | null;
  birthday: string;
  iconName: string;
  soundUrl: string;
}

export type NewUser = Omit<User, 'id'>;
