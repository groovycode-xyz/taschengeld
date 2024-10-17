import { NextResponse } from 'next/server';
import { taskRepository } from '@/app/lib/taskRepository';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const task = await taskRepository.getById(params.id);
    if (task) {
      return NextResponse.json(task);
    } else {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Failed to fetch task:', error);
    return NextResponse.json({ error: 'Failed to fetch task' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const task = await taskRepository.update(params.id, body);
    if (task) {
      return NextResponse.json(task);
    } else {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Failed to update task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const success = await taskRepository.delete(params.id);
    if (success) {
      return NextResponse.json({ message: 'Task deleted successfully' });
    } else {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Failed to delete task:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
