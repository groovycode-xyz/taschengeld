import pool from '../db';

export const settingsService = {
  async get(key: string) {
    const result = await pool.query(
      'SELECT setting_value FROM app_settings WHERE setting_key = $1',
      [key]
    );
    return result.rows[0]?.setting_value || null;
  },

  async set(key: string, value: string | null) {
    const result = await pool.query(
      `INSERT INTO app_settings (setting_key, setting_value)
       VALUES ($1, $2)
       ON CONFLICT (setting_key) 
       DO UPDATE SET setting_value = $2, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [key, value]
    );
    return result.rows[0].setting_value;
  },
};
