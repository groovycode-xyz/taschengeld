import pool from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const client = await pool.connect();
  try {
    // Get only essential user data
    const users = await client.query(`
      SELECT 
        name,
        icon,
        soundurl,
        birthday,
        role
      FROM users
      WHERE role = 'child'  -- Only backup child users
      ORDER BY name;
    `);

    return NextResponse.json({
      users: users.rows,
    });
  } catch (error) {
    console.error('Error fetching users data:', error);
    return NextResponse.json({ error: 'Failed to fetch users data' }, { status: 500 });
  } finally {
    client.release();
  }
}
