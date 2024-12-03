import pool from './db';
import { PiggyBankUser } from '@/app/types/piggyBankUser';

export const piggyBankDashboardRepository = {
  async getDashboardData(): Promise<PiggyBankUser[]> {
    const client = await pool.connect();
    try {
      // Get all users with their piggy bank accounts
      const query = `
        WITH recent_transactions AS (
          SELECT 
            pt.account_id,
            pt.transaction_id,
            pt.amount,
            pt.transaction_type,
            pt.description,
            pt.transaction_date,
            t.title as task_title
          FROM 
            piggybank_transactions pt
          LEFT JOIN 
            completed_tasks ct ON pt.completed_task_id = ct.c_task_id
          LEFT JOIN 
            tasks t ON ct.task_id = t.task_id
          WHERE pt.transaction_date >= NOW() - INTERVAL '30 days'
        )
        SELECT 
          u.user_id,
          u.name,
          u.icon,
          pa.account_id,
          pa.account_number,
          pa.balance,
          COALESCE(
            json_agg(
              json_build_object(
                'transaction_id', rt.transaction_id,
                'amount', rt.amount,
                'transaction_type', rt.transaction_type,
                'description', rt.description,
                'transaction_date', rt.transaction_date,
                'task_title', rt.task_title
              )
              ORDER BY rt.transaction_date DESC
            ) FILTER (WHERE rt.transaction_id IS NOT NULL),
            '[]'
          ) as recent_transactions
        FROM 
          users u
        JOIN 
          piggybank_accounts pa ON u.user_id = pa.user_id
        LEFT JOIN 
          recent_transactions rt ON pa.account_id = rt.account_id
        GROUP BY 
          u.user_id, u.name, u.icon, pa.account_id, pa.account_number, pa.balance
        ORDER BY 
          u.name ASC
      `;

      const result = await client.query(query);

      return result.rows.map((row) => ({
        user_id: row.user_id,
        name: row.name,
        icon: row.icon,
        account: {
          account_id: row.account_id,
          account_number: row.account_number,
          balance: row.balance,
        },
        recent_transactions: row.recent_transactions || [],
      }));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    } finally {
      client.release();
    }
  }
};
