import pool from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function POST() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // TRUNCATE with CASCADE will handle all related records in completed_tasks
    await client.query(`
      TRUNCATE TABLE tasks CASCADE;
    `);

    await client.query('COMMIT');
    return NextResponse.json({ message: 'All tasks have been reset successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error resetting tasks:', error);
    return NextResponse.json({ error: 'Failed to reset tasks' }, { status: 500 });
  } finally {
    client.release();
  }
}
