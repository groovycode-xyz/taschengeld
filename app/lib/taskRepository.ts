import pool from './db';
import { Task } from '@/app/types/task';

interface TaskRow {
  task_id: string;
  title: string;
  description: string;
  icon_name: string;
  sound_url: string | null;
  payout_value: string;
  is_active: boolean | string;
  created_at: string;
  updated_at: string;
}

const mapTaskFromDb = (task: TaskRow): Task => ({
  ...task,
  task_id: task.task_id,
  payout_value: parseFloat(task.payout_value),
  is_active: task.is_active === true || task.is_active === 'true',
  created_at: new Date(task.created_at),
  updated_at: new Date(task.updated_at),
});

export const taskRepository = {
  getAll: async (): Promise<Task[]> => {
    const result = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
    return result.rows.map(mapTaskFromDb);
  },

  getById: async (id: string): Promise<Task | null> => {
    const result = await pool.query('SELECT * FROM tasks WHERE task_id = $1', [id]);
    return result.rows[0] ? mapTaskFromDb(result.rows[0]) : null;
  },

  create: async (task: Omit<Task, 'task_id' | 'created_at' | 'updated_at'>): Promise<Task> => {
    const { title, description, icon_name, sound_url, payout_value, is_active } = task;
    const result = await pool.query(
      'INSERT INTO tasks (title, description, icon_name, sound_url, payout_value, is_active) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, description, icon_name, sound_url, payout_value, is_active]
    );
    return mapTaskFromDb(result.rows[0]);
  },

  update: async (id: string, task: Partial<Task>): Promise<Task | null> => {
    const { title, description, icon_name, sound_url, payout_value, is_active } = task;
    const result = await pool.query(
      'UPDATE tasks SET title = COALESCE($1, title), description = COALESCE($2, description), icon_name = COALESCE($3, icon_name), sound_url = COALESCE($4, sound_url), payout_value = COALESCE($5, payout_value), is_active = COALESCE($6, is_active), updated_at = CURRENT_TIMESTAMP WHERE task_id = $7 RETURNING *',
      [title, description, icon_name, sound_url, payout_value, is_active, id]
    );
    return result.rows[0] ? mapTaskFromDb(result.rows[0]) : null;
  },

  delete: async (id: string): Promise<boolean> => {
    const result = await pool.query('DELETE FROM tasks WHERE task_id = $1', [id]);
    return result.rowCount ? result.rowCount > 0 : false;
  },

  async getActiveTasks(): Promise<Task[]> {
    console.log('getActiveTasks called');
    try {
      console.log('Executing query...');
      const query = 'SELECT * FROM tasks WHERE is_active = true ORDER BY created_at DESC';
      const result = await pool.query(query);
      console.log('Query result:', result.rows);
      const mappedTasks = result.rows.map(mapTaskFromDb);
      console.log('Mapped tasks:', mappedTasks);
      return mappedTasks;
    } catch (error) {
      console.error('Error in getActiveTasks:', error);
      throw error;
    }
  },
};
