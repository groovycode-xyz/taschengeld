import pool from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const client = await pool.connect();
  try {
    const { users } = await request.json();

    await client.query('BEGIN');

    // Clear existing child users
    await client.query('DELETE FROM users WHERE role = $1', ['child']);

    // Insert new users
    for (const user of users) {
      await client.query(
        `
        INSERT INTO users (name, icon, soundurl, birthday, role)
        VALUES ($1, $2, $3, $4, $5)
      `,
        [user.name, user.icon, user.soundurl, user.birthday, user.role]
      );
    }

    await client.query('COMMIT');
    return NextResponse.json({ message: 'Users restored successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error restoring users:', error);
    return NextResponse.json({ error: 'Failed to restore users' }, { status: 500 });
  } finally {
    client.release();
  }
}
