import { NextResponse } from 'next/server';
import { completedTaskRepository } from '../../lib/completedTaskRepository';
import { CreateCompletedTaskInput, CompletedTask } from '../../types/completedTask';

export async function POST(request: Request) {
  try {
    const body: CreateCompletedTaskInput = await request.json();
    console.log('Received completed task data:', body);
    const completedTask: CompletedTask = await completedTaskRepository.create(body);
    return NextResponse.json(completedTask, { status: 201 });
  } catch (error) {
    console.error('Failed to create completed task:', error);
    return NextResponse.json({ error: 'Failed to create completed task' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const completedTasks: CompletedTask[] = await completedTaskRepository.getAll();
    return NextResponse.json(completedTasks);
  } catch (error) {
    console.error('Failed to fetch completed tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch completed tasks' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { c_task_id, ...updatedData } = await request.json();
    if (!c_task_id) {
      return NextResponse.json({ error: 'c_task_id is required' }, { status: 400 });
    }
    const updatedTask = await completedTaskRepository.update(c_task_id, updatedData);
    if (!updatedTask) {
      return NextResponse.json({ error: 'Completed task not found' }, { status: 404 });
    }
    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('Failed to update completed task:', error);
    return NextResponse.json({ error: 'Failed to update completed task' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const c_task_id = searchParams.get('c_task_id');
    if (!c_task_id) {
      return NextResponse.json({ error: 'c_task_id is required' }, { status: 400 });
    }
    const deletedTask = await completedTaskRepository.delete(Number(c_task_id));
    if (!deletedTask) {
      return NextResponse.json({ error: 'Completed task not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Completed task deleted successfully' });
  } catch (error) {
    console.error('Failed to delete completed task:', error);
    return NextResponse.json({ error: 'Failed to delete completed task' }, { status: 500 });
  }
}
