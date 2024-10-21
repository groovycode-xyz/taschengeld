import { NextResponse } from 'next/server';
import { userRepository } from '@/app/lib/userRepository';

export async function GET() {
  try {
    const childUsers = await userRepository.getChildUsers();
    return NextResponse.json(childUsers);
  } catch (error) {
    console.error('Failed to fetch child users:', error);
    return NextResponse.json({ error: 'Failed to fetch child users' }, { status: 500 });
  }
}
