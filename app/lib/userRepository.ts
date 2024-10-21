import pool from './db';
import { User, CreateUserInput } from '@/app/types/user';

export const userRepository = {
  getAll: async (): Promise<User[]> => {
    const result = await pool.query('SELECT * FROM users');
    return result.rows;
  },

  getById: async (id: string): Promise<User | null> => {
    const result = await pool.query('SELECT * FROM users WHERE user_id = $1', [id]);
    return result.rows[0] || null;
  },

  create: async (user: CreateUserInput): Promise<User> => {
    const { name, icon, soundurl, birthday, role } = user;
    console.log('Creating user with data:', { name, icon, soundurl, birthday, role });
    const result = await pool.query(
      'INSERT INTO users (name, icon, soundurl, birthday, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, icon, soundurl, birthday, role]
    );
    return result.rows[0];
  },

  update: async (id: string, user: Partial<User>): Promise<User | null> => {
    const { name, icon, soundurl, birthday, role } = user;
    console.log('Updating user in database:', { id, name, icon, soundurl, birthday, role });
    const result = await pool.query(
      'UPDATE users SET name = COALESCE($1, name), icon = COALESCE($2, icon), soundurl = COALESCE($3, soundurl), birthday = COALESCE($4, birthday), role = COALESCE($5, role) WHERE user_id = $6 RETURNING *',
      [name, icon, soundurl, birthday, role, id]
    );
    console.log('Update result:', result.rows[0]);
    return result.rows[0] || null;
  },

  delete: async (id: string): Promise<boolean> => {
    const result = await pool.query('DELETE FROM users WHERE user_id = $1', [id]);
    return result.rowCount ? result.rowCount > 0 : false;
  },

  async getChildUsers(): Promise<User[]> {
    const query = 'SELECT * FROM users WHERE role = $1 ORDER BY name';
    const result = await pool.query(query, ['child']);
    return result.rows;
  },
};
