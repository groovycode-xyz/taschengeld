import pool from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const client = await pool.connect();
  try {
    // Get only essential task data
    const tasks = await client.query(`
      SELECT 
        title,
        description,
        icon_name,
        sound_url,
        payout_value,
        is_active
      FROM tasks
      ORDER BY title;
    `);

    // For completed tasks, we might want to keep some historical data
    // but exclude system-generated IDs
    const completedTasks = await client.query(`
      SELECT 
        user_id,
        description,
        payout_value,
        comment,
        attachment,
        payment_status
      FROM completed_tasks
      ORDER BY created_at DESC;
    `);

    return NextResponse.json({
      tasks: tasks.rows,
      completed_tasks: completedTasks.rows,
    });
  } catch (error) {
    console.error('Error fetching tasks data:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks data' }, { status: 500 });
  } finally {
    client.release();
  }
}
