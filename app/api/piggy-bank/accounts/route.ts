import pool from '@/app/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT 
        pa.account_id,
        u.name as user_name,
        pa.balance
      FROM piggybank_accounts pa
      JOIN users u ON pa.user_id = u.user_id
      ORDER BY u.name ASC
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 500 });
  } finally {
    client.release();
  }
}
