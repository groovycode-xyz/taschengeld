import pool from './db';
import { CreateCompletedTaskInput, CompletedTask } from '../types/completedTask';

export const completedTaskRepository = {
  async create(completedTask: CreateCompletedTaskInput) {
    const { user_id, task_id, comment, attachment } = completedTask;
    const query = `
      INSERT INTO completed_tasks (user_id, task_id, comment, attachment)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [user_id, task_id, comment, attachment];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async getAll() {
    const query = 'SELECT * FROM completed_tasks ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  },

  async update(c_task_id: number, updatedTask: Partial<CompletedTask>) {
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
    return result.rows[0];
  },

  async delete(c_task_id: number) {
    const query = 'DELETE FROM completed_tasks WHERE c_task_id = $1 RETURNING *';
    const result = await pool.query(query, [c_task_id]);
    return result.rows[0];
  },
};
