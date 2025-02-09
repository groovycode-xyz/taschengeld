import pool from './db';
import { CompletedTask, CreateCompletedTaskInput, PaymentStatus } from '@/app/types/completedTask';

console.log('Database connection:', pool.options);

const validatePaymentStatus = (status: string): PaymentStatus => {
  if (!Object.values(PaymentStatus).includes(status as PaymentStatus)) {
    throw new Error(
      `Invalid payment status: ${status}. Must be one of: ${Object.values(PaymentStatus).join(', ')}`
    );
  }
  return status as PaymentStatus;
};

export const completedTaskRepository = {
  async getAll(): Promise<CompletedTask[]> {
    const query = `
      SELECT 
        ct.*, 
        t.title AS task_title, 
        t.icon_name, 
        u.name AS user_name, 
        u.icon AS user_icon
      FROM 
        completed_tasks ct
      JOIN 
        tasks t ON ct.task_id = t.task_id
      JOIN 
        users u ON ct.user_id = u.user_id
      ORDER BY 
        ct.created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows.map((row) => ({
      ...row,
      payment_status: validatePaymentStatus(row.payment_status),
      created_at: new Date(row.created_at),
    }));
  },

  async getByUserId(userId: number): Promise<CompletedTask[]> {
    const query = `
      SELECT 
        ct.*, 
        t.title AS task_title, 
        t.icon_name, 
        u.name AS user_name, 
        u.icon AS user_icon
      FROM 
        completed_tasks ct
      JOIN 
        tasks t ON ct.task_id = t.task_id
      JOIN 
        users u ON ct.user_id = u.user_id
      WHERE 
        ct.user_id = $1
      ORDER BY 
        ct.created_at DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows.map((row) => ({
      ...row,
      payment_status: validatePaymentStatus(row.payment_status),
      created_at: new Date(row.created_at),
    }));
  },

  async create(completedTaskInput: CreateCompletedTaskInput): Promise<CompletedTask> {
    validatePaymentStatus('Unpaid'); // Default status
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const insertQuery = `
        INSERT INTO completed_tasks (user_id, task_id, description, payout_value, comment, attachment, payment_status)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;
      const insertValues = [
        completedTaskInput.user_id,
        completedTaskInput.task_id,
        '', // description
        0, // payout_value (to be updated)
        completedTaskInput.comment || null,
        completedTaskInput.attachment || null,
        'Unpaid', // Default status
      ];

      const result = await client.query(insertQuery, insertValues);
      const newCompletedTask = result.rows[0];

      // Fetch additional data
      const taskQuery = 'SELECT title, payout_value, icon_name FROM tasks WHERE task_id = $1';
      const taskResult = await client.query(taskQuery, [completedTaskInput.task_id]);
      const taskData = taskResult.rows[0];

      const userQuery = 'SELECT name, icon FROM users WHERE user_id = $1';
      const userResult = await client.query(userQuery, [completedTaskInput.user_id]);
      const userData = userResult.rows[0];

      // Update the completed task with task data
      const updateQuery = `
        UPDATE completed_tasks
        SET description = $1, payout_value = $2
        WHERE c_task_id = $3
        RETURNING *
      `;
      const updateResult = await client.query(updateQuery, [
        taskData.title,
        taskData.payout_value,
        newCompletedTask.c_task_id,
      ]);
      const updatedCompletedTask = updateResult.rows[0];

      await client.query('COMMIT');

      return {
        ...updatedCompletedTask,
        task_title: taskData.title,
        user_name: userData.name,
        icon_name: taskData.icon_name,
        user_icon: userData.icon,
        payment_status: validatePaymentStatus(updatedCompletedTask.payment_status),
        created_at: new Date(updatedCompletedTask.created_at),
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  async updatePaymentStatus(cTaskId: number, paymentStatus: string): Promise<CompletedTask | null> {
    validatePaymentStatus(paymentStatus);
    const query = `
      UPDATE completed_tasks
      SET payment_status = $1
      WHERE c_task_id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [paymentStatus, cTaskId]);
    return result.rows[0]
      ? {
          ...result.rows[0],
          payment_status: validatePaymentStatus(result.rows[0].payment_status),
          created_at: new Date(result.rows[0].created_at),
        }
      : null;
  },

  async getById(c_task_id: number): Promise<CompletedTask | null> {
    const query = 'SELECT * FROM completed_tasks WHERE c_task_id = $1';
    const result = await pool.query(query, [c_task_id]);
    return result.rows[0]
      ? {
          ...result.rows[0],
          payment_status: validatePaymentStatus(result.rows[0].payment_status),
          created_at: new Date(result.rows[0].created_at),
        }
      : null;
  },

  async update(
    c_task_id: number,
    updatedTask: Partial<CompletedTask>
  ): Promise<CompletedTask | null> {
    if (updatedTask.payment_status) {
      validatePaymentStatus(updatedTask.payment_status);
    }
    const { user_id, task_id, comment, attachment, payment_status } = updatedTask;
    const query = `
      UPDATE completed_tasks
      SET user_id = COALESCE($1, user_id),
          task_id = COALESCE($2, task_id),
          comment = COALESCE($3, comment),
          attachment = COALESCE($4, attachment),
          payment_status = COALESCE($5, payment_status)
      WHERE c_task_id = $6
      RETURNING *
    `;
    const values = [user_id, task_id, comment, attachment, payment_status, c_task_id];
    const result = await pool.query(query, values);
    return result.rows[0]
      ? {
          ...result.rows[0],
          payment_status: validatePaymentStatus(result.rows[0].payment_status),
          created_at: new Date(result.rows[0].created_at),
        }
      : null;
  },

  async delete(c_task_id: number): Promise<boolean> {
    const query = 'DELETE FROM completed_tasks WHERE c_task_id = $1';
    const result = await pool.query(query, [c_task_id]);
    return result.rowCount > 0;
  },

  async clearAll(): Promise<void> {
    const query = 'DELETE FROM completed_tasks';
    console.log('Executing SQL query:', query);
    await pool.query(query);
    console.log('Cleared all completed tasks');
  },

  /**
   * Deletes all completed tasks associated with a specific user.
   * @param userId - The ID of the user.
   * @returns A promise that resolves when the deletion is complete.
   */
  async deleteByUserId(userId: number): Promise<void> {
    const query = 'DELETE FROM completed_tasks WHERE user_id = $1';
    await pool.query(query, [userId]);
  },

  async getFullTaskDetails(cTaskId: number): Promise<CompletedTask | null> {
    const query = `
      SELECT 
        ct.c_task_id,
        ct.payment_status,
        ct.payout_value,
        t.title AS task_title,
        t.payout_value as task_payout_value,
        u.piggybank_account_id,
        u.name AS user_name,
        pa.account_id,
        pa.balance
      FROM 
        completed_tasks ct
      JOIN 
        tasks t ON ct.task_id = t.task_id
      JOIN 
        users u ON ct.user_id = u.user_id
      JOIN
        piggybank_accounts pa ON u.user_id = pa.user_id
      WHERE 
        ct.c_task_id = $1;
    `;
    console.log('Executing getFullTaskDetails query for c_task_id:', cTaskId);
    const result = await pool.query(query, [cTaskId]);
    console.log('Full task details query result:', result.rows[0]);
    return result.rows[0]
      ? {
          ...result.rows[0],
          payment_status: validatePaymentStatus(result.rows[0].payment_status),
          created_at: new Date(result.rows[0].created_at),
        }
      : null;
  },
};
