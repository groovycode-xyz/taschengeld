import { NextResponse } from 'next/server';
import { taskRepository } from '@/app/lib/taskRepository';

export async function GET() {
  try {
    const activeTasks = await taskRepository.getActiveTasks();
    return NextResponse.json(activeTasks);
  } catch (error) {
    console.error('Failed to fetch active tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch active tasks' }, { status: 500 });
  }
}
