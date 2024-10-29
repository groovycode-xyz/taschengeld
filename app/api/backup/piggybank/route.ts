import pool from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const client = await pool.connect();
  try {
    // Get only essential account data
    const accounts = await client.query(`
      SELECT 
        pa.account_number,
        pa.balance,
        u.name as user_name  -- Include user name for reference
      FROM piggybank_accounts pa
      JOIN users u ON pa.user_id = u.user_id
      ORDER BY u.name;
    `);

    // Get essential transaction data
    const transactions = await client.query(`
      SELECT 
        pt.amount,
        pt.transaction_type,
        pt.description,
        pt.photo,
        u.name as user_name,  -- Include user name for reference
        pt.transaction_date
      FROM piggybank_transactions pt
      JOIN piggybank_accounts pa ON pt.account_id = pa.account_id
      JOIN users u ON pa.user_id = u.user_id
      ORDER BY pt.transaction_date DESC;
    `);

    return NextResponse.json({
      accounts: accounts.rows,
      transactions: transactions.rows,
    });
  } catch (error) {
    console.error('Error fetching piggy bank data:', error);
    return NextResponse.json({ error: 'Failed to fetch piggy bank data' }, { status: 500 });
  } finally {
    client.release();
  }
}
