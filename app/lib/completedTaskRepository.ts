import pool from './db';
import { CreateCompletedTaskInput, CompletedTask } from '../types/completedTask';

console.log('Database connection:', pool.options);

export const completedTaskRepository = {
  async create(completedTask: CreateCompletedTaskInput): Promise<CompletedTask> {
    const { user_id, task_id, comment, attachment } = completedTask;
    const query = `
      INSERT INTO completed_tasks (user_id, task_id, comment, attachment)
      VALUES ($1, $2, $3, $4)
      RETURNING c_task_id
    `;
    const values = [user_id, task_id, comment, attachment];
    const result = await pool.query(query, values);
    const c_task_id = result.rows[0].c_task_id;

    // Fetch the complete task information
    const fetchQuery = `
      SELECT 
        ct.*,
        u.name as user_name,
        u.icon as user_icon,
        t.title as task_title,
        t.icon_name
      FROM completed_tasks ct
      JOIN users u ON ct.user_id = u.user_id
      JOIN tasks t ON ct.task_id = t.task_id
      WHERE ct.c_task_id = $1
    `;
    const fetchResult = await pool.query(fetchQuery, [c_task_id]);
    return fetchResult.rows[0];
  },

  async getAll(): Promise<CompletedTask[]> {
    const query = `
      SELECT 
        ct.*,
        u.name as user_name,
        u.icon as user_icon,
        t.title as task_title,
        t.icon_name
      FROM completed_tasks ct
      JOIN users u ON ct.user_id = u.user_id
      JOIN tasks t ON ct.task_id = t.task_id
      ORDER BY ct.created_at DESC
    `;
    console.log('Executing SQL query:', query);
    const result = await pool.query(query);
    console.log('Fetched completed tasks:', result.rows);
    return result.rows;
  },

  async getById(c_task_id: number): Promise<CompletedTask | null> {
    const query = 'SELECT * FROM completed_tasks WHERE c_task_id = $1';
    const result = await pool.query(query, [c_task_id]);
    return result.rows[0] || null;
  },

  async update(
    c_task_id: number,
    updatedTask: Partial<CompletedTask>
  ): Promise<CompletedTask | null> {
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
    return result.rows[0] || null;
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
};
