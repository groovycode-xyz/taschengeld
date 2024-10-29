import pool from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const client = await pool.connect();
  try {
    // Get users data
    const users = await client.query(`
      SELECT 
        name,
        icon,
        soundurl,
        birthday,
        role
      FROM users
      WHERE role = 'child'
      ORDER BY name;
    `);

    // Get tasks data
    const tasks = await client.query(`
      SELECT 
        title,
        description,
        icon_name,
        sound_url,
        payout_value,
        is_active
      FROM tasks
      ORDER BY title;
    `);

    // Get completed tasks data
    const completedTasks = await client.query(`
      SELECT 
        user_id,
        description,
        payout_value,
        comment,
        attachment,
        payment_status
      FROM completed_tasks
      ORDER BY created_at DESC;
    `);

    // Get accounts data
    const accounts = await client.query(`
      SELECT 
        pa.account_number,
        pa.balance,
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
        pt.transaction_date
      FROM piggybank_transactions pt
      JOIN piggybank_accounts pa ON pt.account_id = pa.account_id
      JOIN users u ON pa.user_id = u.user_id
      ORDER BY pt.transaction_date DESC;
    `);

    return NextResponse.json({
      users: users.rows,
      tasks: tasks.rows,
      completed_tasks: completedTasks.rows,
      accounts: accounts.rows,
      transactions: transactions.rows,
    });
  } catch (error) {
    console.error('Error fetching all data:', error);
    return NextResponse.json({ error: 'Failed to fetch all data' }, { status: 500 });
  } finally {
    client.release();
  }
}
