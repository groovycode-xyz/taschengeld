import pool from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const client = await pool.connect();
  try {
    const { users, tasks, accounts, transactions } = await request.json();

    await client.query('BEGIN');

    // Clear all existing data
    await client.query(`
      TRUNCATE 
        users, 
        tasks, 
        piggybank_accounts, 
        piggybank_transactions 
      CASCADE;
    `);

    // Restore users
    for (const user of users) {
      await client.query(
        `
        INSERT INTO users (name, icon, soundurl, birthday, role)
        VALUES ($1, $2, $3, $4, $5)
      `,
        [user.name, user.icon, user.soundurl, user.birthday, user.role]
      );
    }

    // Restore tasks
    for (const task of tasks) {
      await client.query(
        `
        INSERT INTO tasks (title, description, icon_name, sound_url, payout_value, is_active)
        VALUES ($1, $2, $3, $4, $5, $6)
      `,
        [
          task.title,
          task.description,
          task.icon_name,
          task.sound_url,
          task.payout_value,
          task.is_active,
        ]
      );
    }

    // Restore accounts (need to get user_ids first)
    for (const account of accounts) {
      const userResult = await client.query('SELECT user_id FROM users WHERE name = $1', [
        account.user_name,
      ]);

      if (userResult.rows[0]) {
        await client.query(
          `
          INSERT INTO piggybank_accounts (user_id, account_number, balance)
          VALUES ($1, $2, $3)
        `,
          [userResult.rows[0].user_id, account.account_number, account.balance]
        );
      }
    }

    // Restore transactions
    for (const transaction of transactions) {
      const accountResult = await client.query(
        `
        SELECT pa.account_id 
        FROM piggybank_accounts pa
        JOIN users u ON pa.user_id = u.user_id
        WHERE u.name = $1
      `,
        [transaction.user_name]
      );

      if (accountResult.rows[0]) {
        await client.query(
          `
          INSERT INTO piggybank_transactions 
          (account_id, amount, transaction_type, description, photo, transaction_date)
          VALUES ($1, $2, $3, $4, $5, $6)
        `,
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

    await client.query('COMMIT');
    return NextResponse.json({ message: 'All data restored successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error restoring all data:', error);
    return NextResponse.json({ error: 'Failed to restore all data' }, { status: 500 });
  } finally {
    client.release();
  }
}
