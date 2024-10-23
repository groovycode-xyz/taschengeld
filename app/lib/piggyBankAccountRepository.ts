import pool from './db';
import { PiggyBankAccount } from '@/app/types/piggyBankAccount';

export const piggyBankAccountRepository = {
  async getAll(): Promise<PiggyBankAccount[]> {
    const query = `
      SELECT pa.*, u.name as user_name, u.icon as user_icon, u.birthday
      FROM piggybank_accounts pa
      JOIN users u ON pa.user_id = u.user_id
      ORDER BY pa.created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  },

  async getByUserId(userId: number): Promise<PiggyBankAccount | null> {
    if (isNaN(userId)) {
      throw new Error('Invalid user ID');
    }
    const query = `
      SELECT pa.*, u.name as user_name, u.icon as user_icon, u.birthday
      FROM piggybank_accounts pa
      JOIN users u ON pa.user_id = u.user_id
      WHERE pa.user_id = $1
    `;
    const result = await pool.query(query, [userId]);
    return result.rows[0] || null;
  },

  async updateBalance(accountId: number, amount: number): Promise<PiggyBankAccount | null> {
    const query = `
      UPDATE piggybank_accounts pa
      SET balance = balance + $1
      FROM users u
      WHERE pa.account_id = $2 AND pa.user_id = u.user_id
      RETURNING pa.*, u.name as user_name, u.icon as user_icon, u.birthday
    `;
    const result = await pool.query(query, [amount, accountId]);
    return result.rows[0] || null;
  },

  async createAccount(
    userId: number,
    accountNumber: string,
    client = pool
  ): Promise<PiggyBankAccount> {
    const query = `
      INSERT INTO piggybank_accounts (user_id, account_number, balance)
      VALUES ($1, $2, 0)
      RETURNING *
    `;
    const result = await client.query(query, [userId, accountNumber]);
    return result.rows[0];
  },
};
