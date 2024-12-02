import pool from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const client = await pool.connect();
  try {
    const data = await request.json();
    console.log('Received data:', JSON.stringify(data, null, 2));

    const { accounts, transactions } = data;
    if (!accounts) {
      throw new Error('No accounts data provided');
    }

    await client.query('BEGIN');

    // First, set all piggybank_account_id to NULL in users table
    await client.query('UPDATE users SET piggybank_account_id = NULL');

    // Then drop the foreign key constraint
    await client.query('ALTER TABLE users DROP CONSTRAINT IF EXISTS fk_user_piggybank_account');

    // Clear existing accounts and transactions
    await client.query('TRUNCATE piggybank_transactions');
    await client.query('TRUNCATE piggybank_accounts CASCADE');

    // Store account mappings (old_id -> new_id)
    const accountMappings = new Map();

    // First restore accounts
    for (const account of accounts) {
      console.log('Processing account:', JSON.stringify(account, null, 2));
      let userId = account.user_id;
      
      // If no user_id but have user_name, try to find user_id
      if (!userId && account.user_name) {
        const userResult = await client.query('SELECT user_id FROM users WHERE name = $1', [
          account.user_name,
        ]);
        if (userResult.rows[0]) {
          userId = userResult.rows[0].user_id;
          console.log('Found user_id:', userId, 'for user_name:', account.user_name);
        }
      }

      if (userId) {
        console.log('Inserting account for user_id:', userId);
        // Insert account with original account_number
        const result = await client.query(
          `INSERT INTO piggybank_accounts (user_id, account_number, balance)
           VALUES ($1, $2, $3)
           RETURNING account_id`,
          [userId, account.account_number, account.balance]
        );
        
        // Store the mapping of old account_id to new account_id
        const newAccountId = result.rows[0].account_id;
        accountMappings.set(account.account_id, newAccountId);
        
        // Update the user's piggybank_account_id
        await client.query(
          `UPDATE users 
           SET piggybank_account_id = $1
           WHERE user_id = $2`,
          [newAccountId, userId]
        );
      } else {
        console.log('No user_id found for account:', account);
      }
    }

    // Then restore transactions
    if (transactions && transactions.length > 0) {
      for (const transaction of transactions) {
        console.log('Processing transaction:', JSON.stringify(transaction, null, 2));
        let accountId = accountMappings.get(transaction.account_id);
        
        // If no mapped account_id but have user_name, try to find account_id
        if (!accountId && transaction.user_name) {
          const accountResult = await client.query(
            `SELECT pa.account_id 
             FROM piggybank_accounts pa
             JOIN users u ON pa.user_id = u.user_id
             WHERE u.name = $1`,
            [transaction.user_name]
          );
          if (accountResult.rows[0]) {
            accountId = accountResult.rows[0].account_id;
            console.log('Found account_id:', accountId, 'for user_name:', transaction.user_name);
          }
        }

        if (accountId) {
          console.log('Inserting transaction for account_id:', accountId);
          await client.query(
            `INSERT INTO piggybank_transactions 
             (account_id, amount, transaction_type, description, photo, transaction_date)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              accountId,
              transaction.amount,
              transaction.transaction_type,
              transaction.description,
              transaction.photo,
              transaction.transaction_date,
            ]
          );
        } else {
          console.log('No account_id found for transaction:', transaction);
        }
      }
    }

    // Restore the foreign key constraint
    await client.query(`
      ALTER TABLE users 
      ADD CONSTRAINT fk_user_piggybank_account 
      FOREIGN KEY (piggybank_account_id) 
      REFERENCES piggybank_accounts(account_id)
    `);

    await client.query('COMMIT');
    return NextResponse.json({ message: 'Piggy bank data restored successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error restoring piggy bank data:', error);
    return NextResponse.json({ 
      error: 'Failed to restore piggy bank data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    client.release();
  }
}
