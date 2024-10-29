import pool from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function POST() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // TRUNCATE with CASCADE will handle all related transactions
    await client.query(`
      TRUNCATE TABLE piggybank_accounts CASCADE;
    `);

    await client.query('COMMIT');
    return NextResponse.json({ message: 'All piggy bank accounts have been reset successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error resetting accounts:', error);
    return NextResponse.json({ error: 'Failed to reset accounts' }, { status: 500 });
  } finally {
    client.release();
  }
}
