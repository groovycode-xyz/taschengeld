import pool from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const client = await pool.connect();
  try {
    // Get accounts data with user information
    const accounts = await client.query(`
      SELECT 
        pa.account_id,
        pa.account_number,
        pa.balance,
        pa.user_id,
        u.name as user_name
      FROM piggybank_accounts pa
      JOIN users u ON pa.user_id = u.user_id
      ORDER BY u.name;
    `);

    // Get transactions data
    const transactions = await client.query(`
      SELECT 
        pt.amount,
        pt.transaction_type,
        pt.description,
        pt.photo,
        u.name as user_name,
        pt.transaction_date,
        pa.account_id
      FROM piggybank_transactions pt
      JOIN piggybank_accounts pa ON pt.account_id = pa.account_id
      JOIN users u ON pa.user_id = u.user_id
      ORDER BY pt.transaction_date DESC;
    `);

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      type: 'piggybank',
      data: {
        piggybank: {
          accounts: accounts.rows,
          transactions: transactions.rows,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching piggy bank data:', error);
    return NextResponse.json({ error: 'Failed to fetch piggy bank data' }, { status: 500 });
  } finally {
    client.release();
  }
}
