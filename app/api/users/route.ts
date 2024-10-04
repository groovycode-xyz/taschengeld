import { NextResponse } from 'next/server';

type User = {
  id: string;
  name: string;
  icon: string;
  sound: string | null;
  birthday: string;
  role: 'parent' | 'child';
};

// Mock database
let users: User[] = [
  {
    id: '1',
    name: 'Parent User',
    icon: 'user',
    sound: 'chime',
    birthday: '1980-01-01',
    role: 'parent',
  },
  {
    id: '2',
    name: 'Child User',
    icon: 'child',
    sound: 'bell',
    birthday: '2010-01-01',
    role: 'child',
  },
];

export async function GET() {
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const newUser: Omit<User, 'id'> = await request.json();
  const user: User = { ...newUser, id: Date.now().toString() };
  users.push(user);
  return NextResponse.json(user, { status: 201 });
}

export async function PUT(request: Request) {
  const updatedUser: User = await request.json();
  users = users.map((user) => (user.id === updatedUser.id ? updatedUser : user));
  return NextResponse.json(updatedUser);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  users = users.filter((user) => user.id !== id);
  return NextResponse.json({ message: 'User deleted successfully' });
}
