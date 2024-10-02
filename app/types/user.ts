export interface User {
  id: string;
  name: string;
  iconName: string;
  soundUrl: string;
  role: 'parent' | 'child';
}