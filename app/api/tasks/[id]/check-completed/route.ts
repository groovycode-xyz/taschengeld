import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const taskId = params.id;

    // Check if there are any completed tasks for this task
    const query = 'SELECT EXISTS(SELECT 1 FROM completed_tasks WHERE task_id = $1)';
    const result = await pool.query(query, [taskId]);

    return NextResponse.json({ hasCompletedTasks: result.rows[0].exists });
  } catch (error) {
    console.error('Error checking completed tasks:', error);
    return NextResponse.json({ error: 'Failed to check completed tasks' }, { status: 500 });
  }
}
