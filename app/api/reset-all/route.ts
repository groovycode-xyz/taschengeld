import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';

export async function POST() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await client.query(`
      TRUNCATE TABLE 
        public.completed_tasks, 
        public.tasks, 
        public.piggybank_transactions, 
        public.piggybank_accounts, 
        public.users 
      RESTART IDENTITY CASCADE;
    `);

    await client.query('COMMIT');

    return NextResponse.json({ message: 'All data has been reset successfully' }, { status: 200 });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error resetting data:', error);
    return NextResponse.json({ error: 'Failed to reset data' }, { status: 500 });
  } finally {
    client.release();
  }
}
