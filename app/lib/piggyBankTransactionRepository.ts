import pool from './db';
import { PiggyBankTransaction } from '@/app/types/piggyBankTransaction';

export const piggyBankTransactionRepository = {
  async addTransaction(
    transaction: Omit<PiggyBankTransaction, 'transaction_id' | 'transaction_date'>
  ): Promise<PiggyBankTransaction> {
    const query = `
      INSERT INTO piggybank_transactions (account_id, amount, transaction_type, description, photo)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [
      transaction.account_id,
      transaction.amount,
      transaction.transaction_type,
      transaction.description,
      transaction.photo,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async getTransactionsByAccountId(accountId: number): Promise<PiggyBankTransaction[]> {
    const query = `
      SELECT * FROM piggybank_transactions
      WHERE account_id = $1
      ORDER BY transaction_date DESC
    `;
    const result = await pool.query(query, [accountId]);
    return result.rows;
  },
};
