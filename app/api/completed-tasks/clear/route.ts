import { NextResponse } from 'next/server';
import { completedTaskRepository } from '@/app/lib/completedTaskRepository';

export async function POST() {
  try {
    await completedTaskRepository.clearAll();
    return NextResponse.json({ message: 'All completed tasks cleared' }, { status: 200 });
  } catch (error) {
    console.error('Failed to clear completed tasks:', error);
    return NextResponse.json({ error: 'Failed to clear completed tasks' }, { status: 500 });
  }
}
