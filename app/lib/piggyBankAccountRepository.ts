import pool from './db';
import { PiggyBankAccount } from '@/app/types/piggyBankAccount';

export const piggyBankAccountRepository = {
  async getAll(): Promise<PiggyBankAccount[]> {
    const query = 'SELECT * FROM piggybank_accounts ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  },

  async getByUserId(userId: number): Promise<PiggyBankAccount | null> {
    if (isNaN(userId)) {
      throw new Error('Invalid user ID');
    }
    const query = 'SELECT * FROM piggybank_accounts WHERE user_id = $1';
    const result = await pool.query(query, [userId]);
    return result.rows[0] || null;
  },

  async updateBalance(accountId: number, amount: number): Promise<PiggyBankAccount | null> {
    const query = `
      UPDATE piggybank_accounts
      SET balance = balance + $1
      WHERE account_id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [amount, accountId]);
    return result.rows[0] || null;
  },

  async createAccount(userId: number, accountNumber: string): Promise<PiggyBankAccount> {
    const query = `
      INSERT INTO piggybank_accounts (user_id, account_number, balance)
      VALUES ($1, $2, 0)
      RETURNING *
    `;
    const result = await pool.query(query, [userId, accountNumber]);
    return result.rows[0];
  },
};
