import pool from './db';
import { PiggyBankTransaction } from '@/app/types/piggyBankTransaction';

export const piggyBankTransactionRepository = {
  async addTransaction(
    transaction: Omit<PiggyBankTransaction, 'transaction_id' | 'transaction_date'>
  ): Promise<PiggyBankTransaction> {
    const query = `
      INSERT INTO piggybank_transactions (
        account_id, 
        amount, 
        transaction_type, 
        description, 
        photo,
        completed_task_id
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [
      transaction.account_id,
      transaction.amount,
      transaction.transaction_type,
      transaction.description,
      transaction.photo,
      transaction.completed_task_id,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async getTransactionsByAccountId(accountId: number): Promise<PiggyBankTransaction[]> {
    const query = `
      SELECT 
        pt.*,
        t.title as task_title,
        t.payout_value
      FROM piggybank_transactions pt
      LEFT JOIN completed_tasks ct ON pt.completed_task_id = ct.c_task_id
      LEFT JOIN tasks t ON ct.task_id = t.task_id
      WHERE pt.account_id = $1
      ORDER BY pt.transaction_date DESC
    `;
    const result = await pool.query(query, [accountId]);
    return result.rows;
  },
};
