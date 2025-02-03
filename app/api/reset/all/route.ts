import pool from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function POST() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Truncate all tables in the correct order
    await client.query(`
      TRUNCATE TABLE 
        users,
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
