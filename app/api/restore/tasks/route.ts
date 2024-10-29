import pool from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const client = await pool.connect();
  try {
    const { tasks } = await request.json();

    await client.query('BEGIN');

    // Clear existing tasks
    await client.query('TRUNCATE tasks CASCADE');

    // Insert new tasks
    for (const task of tasks) {
      await client.query(
        `
        INSERT INTO tasks (title, description, icon_name, sound_url, payout_value, is_active)
        VALUES ($1, $2, $3, $4, $5, $6)
      `,
        [
          task.title,
          task.description,
          task.icon_name,
          task.sound_url,
          task.payout_value,
          task.is_active,
        ]
      );
    }

    await client.query('COMMIT');
    return NextResponse.json({ message: 'Tasks restored successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error restoring tasks:', error);
    return NextResponse.json({ error: 'Failed to restore tasks' }, { status: 500 });
  } finally {
    client.release();
  }
}
