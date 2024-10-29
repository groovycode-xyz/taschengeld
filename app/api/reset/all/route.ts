import pool from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function POST() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Delete child users first (preserves parent user)
    await client.query(`
      DELETE FROM users 
      WHERE role = 'child';
    `);

    // Then truncate all other tables
    await client.query(`
      TRUNCATE TABLE 
        tasks,
        completed_tasks,
        piggybank_accounts,
        piggybank_transactions
      CASCADE;
    `);

    await client.query('COMMIT');
    return NextResponse.json({ message: 'All data has been reset successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error resetting all data:', error);
    return NextResponse.json({ error: 'Failed to reset all data' }, { status: 500 });
  } finally {
    client.release();
  }
}
