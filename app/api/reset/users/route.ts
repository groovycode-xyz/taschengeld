import pool from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function POST() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Delete only child users to preserve the parent user
    await client.query(`
      DELETE FROM users 
      WHERE role = 'child';
    `);

    await client.query('COMMIT');
    return NextResponse.json({ message: 'All child users have been reset successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error resetting users:', error);
    return NextResponse.json({ error: 'Failed to reset users' }, { status: 500 });
  } finally {
    client.release();
  }
}
