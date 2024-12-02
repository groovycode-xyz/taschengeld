import pool from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const client = await pool.connect();
  try {
    const { users, tasks, completed_tasks, accounts, transactions } = await request.json();

    await client.query('BEGIN');

    // First, set all piggybank_account_id to NULL in users table
    await client.query('UPDATE users SET piggybank_account_id = NULL');

    // Then drop the foreign key constraint
    await client.query('ALTER TABLE users DROP CONSTRAINT IF EXISTS fk_user_piggybank_account');

    // Clear all existing data
    await client.query(`
      TRUNCATE 
        users, 
        tasks, 
        completed_tasks,
        piggybank_accounts, 
        piggybank_transactions 
      CASCADE;
    `);

    // Store ID mappings
    const userMappings = new Map();
    const taskMappings = new Map();
    const accountMappings = new Map();

    // Restore users
    for (const user of users) {
      const result = await client.query(
        `
        INSERT INTO users (name, icon, soundurl, birthday, role)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING user_id
        `,
        [user.name, user.icon, user.soundurl, user.birthday, user.role]
      );
      userMappings.set(user.name, result.rows[0].user_id);
    }

    // Restore tasks
    for (const task of tasks) {
      const result = await client.query(
        `
        INSERT INTO tasks (title, description, icon_name, sound_url, payout_value, is_active)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING task_id
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
      taskMappings.set(task.title, result.rows[0].task_id);
    }

    // Restore accounts
    for (const account of accounts) {
      const userId = userMappings.get(account.user_name);
      if (userId) {
        const result = await client.query(
          `
          INSERT INTO piggybank_accounts (user_id, account_number, balance)
          VALUES ($1, $2, $3)
          RETURNING account_id
          `,
          [userId, account.account_number, account.balance]
        );
        const newAccountId = result.rows[0].account_id;
        accountMappings.set(account.account_number, newAccountId);

        // Update the user's piggybank_account_id
        await client.query(
          `UPDATE users 
           SET piggybank_account_id = $1
           WHERE user_id = $2`,
          [newAccountId, userId]
        );
      }
    }

    // Restore completed tasks
    if (completed_tasks && completed_tasks.length > 0) {
      for (const ct of completed_tasks) {
        const userId = userMappings.get(ct.user_name);
        const taskId = taskMappings.get(ct.task_title);
        
        if (userId && taskId) {
          await client.query(
            `
            INSERT INTO completed_tasks 
            (user_id, task_id, description, payout_value, comment, attachment, payment_status)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            `,
            [
              userId,
              taskId,
              ct.description,
              ct.payout_value,
              ct.comment,
              ct.attachment,
              ct.payment_status,
            ]
          );
        }
      }
    }

    // Restore transactions
    if (transactions && transactions.length > 0) {
      for (const transaction of transactions) {
        const accountId = accountMappings.get(transaction.account_number);
        if (accountId) {
          await client.query(
            `
            INSERT INTO piggybank_transactions 
            (account_id, amount, transaction_type, description, photo, transaction_date)
            VALUES ($1, $2, $3, $4, $5, $6)
            `,
            [
              accountId,
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

    // Restore the foreign key constraint
    await client.query(`
      ALTER TABLE users 
      ADD CONSTRAINT fk_user_piggybank_account 
      FOREIGN KEY (piggybank_account_id) 
      REFERENCES piggybank_accounts(account_id)
    `);

    await client.query('COMMIT');
    return NextResponse.json({ message: 'All data restored successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error restoring all data:', error);
    return NextResponse.json({ 
      error: 'Failed to restore all data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    client.release();
  }
}
