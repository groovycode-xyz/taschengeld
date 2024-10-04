import { NextResponse } from 'next/server';
import { db } from '@/app/lib/mockDb';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const task = db.tasks.getById(params.id);
  if (task) {
    const updatedTask = db.tasks.update(params.id, { isActive: !task.isActive });
    return NextResponse.json(updatedTask);
  } else {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }
}
