import { NextResponse } from 'next/server';
import { db } from '@/app/lib/mockDb';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const task = db.tasks.getById(params.id);
  if (task) {
    return NextResponse.json(task);
  } else {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const updatedTask = db.tasks.update(params.id, body);
  if (updatedTask) {
    return NextResponse.json(updatedTask);
  } else {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const success = db.tasks.delete(params.id);
  if (success) {
    return NextResponse.json({ message: 'Task deleted successfully' });
  } else {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }
}