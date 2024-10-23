import pool from './db';
import { User, CreateUserInput } from '@/app/types/user';
import { piggyBankAccountRepository } from './piggyBankAccountRepository';

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

  async createUser(user: Omit<User, 'user_id'>): Promise<User> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Create user
      const userQuery = `
        INSERT INTO users (name, icon, soundurl, birthday, role)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      const userResult = await client.query(userQuery, [
        user.name,
        user.icon,
        user.soundurl,
        user.birthday,
        user.role,
      ]);
      const newUser = userResult.rows[0];

      // Create piggy bank account
      const accountNumber = `PB${newUser.user_id.toString().padStart(6, '0')}`;
      const account = await piggyBankAccountRepository.createAccount(
        newUser.user_id,
        accountNumber,
        client
      );

      // Update user with piggy bank account id
      const updateUserQuery = `
        UPDATE users SET piggybank_account_id = $1 WHERE user_id = $2 RETURNING *
      `;
      const updatedUserResult = await client.query(updateUserQuery, [
        account.account_id,
        newUser.user_id,
      ]);

      await client.query('COMMIT');
      return updatedUserResult.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  async deleteUser(userId: number): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Delete piggy bank transactions
      await client.query(
        'DELETE FROM piggybank_transactions WHERE account_id IN (SELECT account_id FROM piggybank_accounts WHERE user_id = $1)',
        [userId]
      );

      // Delete piggy bank account
      await client.query('DELETE FROM piggybank_accounts WHERE user_id = $1', [userId]);

      // Delete user
      await client.query('DELETE FROM users WHERE user_id = $1', [userId]);

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },
};
