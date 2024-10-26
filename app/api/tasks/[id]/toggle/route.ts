import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    // First get the current task
    const getTaskQuery = 'SELECT * FROM tasks WHERE task_id = $1';
    const taskResult = await pool.query(getTaskQuery, [params.id]);

    if (taskResult.rows.length === 0) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const task = taskResult.rows[0];

    // Update the task's is_active status
    const updateQuery = 'UPDATE tasks SET is_active = $1 WHERE task_id = $2 RETURNING *';
    const result = await pool.query(updateQuery, [!task.is_active, params.id]);

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error toggling task:', error);
    return NextResponse.json({ error: 'Failed to toggle task status' }, { status: 500 });
  }
}
