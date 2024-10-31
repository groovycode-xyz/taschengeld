import pool from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const client = await pool.connect();
  try {
    const { accounts, transactions } = await request.json();

    await client.query('BEGIN');

    // Clear existing accounts and transactions
    await client.query('TRUNCATE piggybank_transactions');
    await client.query('TRUNCATE piggybank_accounts');

    // First restore accounts
    for (const account of accounts) {
      // Find user_id by name
      const userResult = await client.query('SELECT user_id FROM users WHERE name = $1', [
        account.user_name,
      ]);

      if (userResult.rows[0]) {
        const userId = userResult.rows[0].user_id;
        // Insert account with original account_number
        await client.query(
          `INSERT INTO piggybank_accounts (user_id, account_number, balance)
           VALUES ($1, $2, $3)`,
          [userId, account.account_number, account.balance]
        );
      }
    }

    // Then restore transactions
    if (transactions && transactions.length > 0) {
      for (const transaction of transactions) {
        // Find account_id by user_name and account_number
        const accountResult = await client.query(
          `SELECT pa.account_id 
           FROM piggybank_accounts pa
           JOIN users u ON pa.user_id = u.user_id
           WHERE u.name = $1`,
          [transaction.user_name]
        );

        if (accountResult.rows[0]) {
          await client.query(
            `INSERT INTO piggybank_transactions 
             (account_id, amount, transaction_type, description, photo, transaction_date)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              accountResult.rows[0].account_id,
              transaction.amount,
              transaction.transaction_type,
              transaction.description,
              transaction.photo,
              transaction.transaction_date,
            ]
          );
        }
      }
    }

    await client.query('COMMIT');
    return NextResponse.json({ message: 'Piggy bank data restored successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error restoring piggy bank data:', error);
    return NextResponse.json({ error: 'Failed to restore piggy bank data' }, { status: 500 });
  } finally {
    client.release();
  }
}
