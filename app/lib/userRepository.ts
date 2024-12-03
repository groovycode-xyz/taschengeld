import pool from './db';
import { User, CreateUserInput } from '@/app/types/user';
import { piggyBankAccountRepository } from './piggyBankAccountRepository';

export const userRepository = {
  async getAll(): Promise<User[]> {
    const result = await pool.query(`
      SELECT 
        user_id,
        name,
        icon,
        soundurl,
        birthday::text as birthday,
        piggybank_account_id,
        created_at,
        sound
      FROM users 
      ORDER BY name ASC
    `);
    return result.rows;
  },

  async getById(id: number): Promise<User | null> {
    const result = await pool.query(`
      SELECT 
        user_id,
        name,
        icon,
        soundurl,
        birthday::text as birthday,
        piggybank_account_id,
        created_at,
        sound
      FROM users 
      WHERE user_id = $1
    `, [id]);
    return result.rows[0] || null;
  },

  async create(user: CreateUserInput): Promise<User> {
    const result = await pool.query(
      'INSERT INTO users (name, icon, soundurl, birthday) VALUES ($1, $2, $3, $4) RETURNING *',
      [user.name, user.icon, user.soundurl, user.birthday]
    );
    return result.rows[0];
  },

  async update(id: number, data: Partial<User>): Promise<User | null> {
    console.log('Updating user with data:', data); // Debug log
    const result = await pool.query(
      'UPDATE users SET name = COALESCE($1, name), icon = COALESCE($2, icon), soundurl = COALESCE($3, soundurl), birthday = COALESCE($4, birthday) WHERE user_id = $5 RETURNING *',
      [data.name, data.icon, data.soundurl, data.birthday, id]
    );
    console.log('Update result:', result.rows[0]); // Debug log
    return result.rows[0] || null;
  },

  async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM users WHERE user_id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  },

  async createUser(user: Omit<User, 'user_id'>): Promise<User> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Create user
      const userQuery = `
        INSERT INTO users (name, icon, soundurl, birthday)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;
      const userResult = await client.query(userQuery, [
        user.name,
        user.icon,
        user.soundurl,
        user.birthday,
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

  async findByName(name: string): Promise<User | null> {
    const result = await pool.query(
      'SELECT * FROM users WHERE LOWER(name) = LOWER($1)',
      [name]
    );
    return result.rows[0] || null;
  },
};
