import { NextResponse } from 'next/server';
import { userRepository } from '@/app/lib/userRepository';

export async function GET() {
  try {
    const users = await userRepository.getAll();
    const hasChildren = users.some((user) => user.role === 'child');

    return NextResponse.json({ hasChildren });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to check for child users' }, { status: 500 });
  }
}
