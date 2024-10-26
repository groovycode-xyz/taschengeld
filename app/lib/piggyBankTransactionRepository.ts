import pool from './db';
import { PiggyBankTransaction } from '@/app/types/piggyBankTransaction';

export const piggyBankTransactionRepository = {
  async createTransaction(
    accountId: number,
    amount: number,
    taskTitle: string,
    completedTaskId: number | null = null
  ): Promise<boolean> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Create the transaction
      const transactionQuery = `
        INSERT INTO piggybank_transactions (
          account_id, 
          amount, 
          transaction_type, 
          description,
          completed_task_id
        )
        VALUES ($1, $2, 'deposit', $3, $4)
        RETURNING *
      `;
      const transactionValues = [
        accountId,
        amount,
        `Payment for task: ${taskTitle}`,
        completedTaskId,
      ];
      const transactionResult = await client.query(transactionQuery, transactionValues);

      // Update the account balance
      const updateBalanceQuery = `
        UPDATE piggybank_accounts 
        SET balance = balance + $1 
        WHERE account_id = $2
        RETURNING *
      `;
      await client.query(updateBalanceQuery, [amount, accountId]);

      await client.query('COMMIT');
      console.log('Transaction created successfully:', transactionResult.rows[0]);
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error creating transaction:', error);
      return false;
    } finally {
      client.release();
    }
  },

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
