import pool from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const client = await pool.connect();
  try {
    const { accountIds } = await request.json();

    await client.query('BEGIN');

    // Delete transactions for specified accounts
    if (accountIds && accountIds.length > 0) {
      // Delete transactions for specific accounts
      await client.query('DELETE FROM piggybank_transactions WHERE account_id = ANY($1)', [
        accountIds,
      ]);

      // Reset balances to 0 for these accounts
      await client.query('UPDATE piggybank_accounts SET balance = 0 WHERE account_id = ANY($1)', [
        accountIds,
      ]);
    } else {
      // If no accounts specified, reset all
      await client.query('TRUNCATE TABLE piggybank_transactions');
      await client.query('UPDATE piggybank_accounts SET balance = 0');
    }

    await client.query('COMMIT');
    return NextResponse.json({
      message: 'Transaction history has been reset successfully',
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error resetting transactions:', error);
    return NextResponse.json(
      {
        error: 'Failed to reset transactions',
      },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
