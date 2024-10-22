import { NextResponse } from 'next/server';
import { completedTaskRepository } from '@/app/lib/completedTaskRepository';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const completedTask = await completedTaskRepository.getById(parseInt(params.id, 10));
    if (completedTask) {
      return NextResponse.json(completedTask);
    } else {
      return NextResponse.json({ error: 'Completed task not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Failed to fetch completed task:', error);
    return NextResponse.json({ error: 'Failed to fetch completed task' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const updatedData = await request.json();
    const updatedTask = await completedTaskRepository.update(parseInt(params.id), updatedData);
    if (updatedTask) {
      return NextResponse.json(updatedTask);
    } else {
      return NextResponse.json({ error: 'Completed task not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Failed to update completed task:', error);
    return NextResponse.json({ error: 'Failed to update completed task' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const success = await completedTaskRepository.delete(parseInt(params.id, 10));
    if (success) {
      return NextResponse.json({ message: 'Completed task deleted successfully' });
    } else {
      return NextResponse.json({ error: 'Completed task not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Failed to delete completed task:', error);
    return NextResponse.json({ error: 'Failed to delete completed task' }, { status: 500 });
  }
}
