import pool from './db';

export const settingsRepository = {
  async getSetting(key: string): Promise<string | null> {
    const result = await pool.query(
      'SELECT setting_value FROM app_settings WHERE setting_key = $1',
      [key]
    );
    return result.rows[0]?.setting_value || null;
  },

  async updateSetting(key: string, value: string | null): Promise<void> {
    await pool.query(
      `
      INSERT INTO app_settings (setting_key, setting_value, updated_at)
      VALUES ($1, $2, CURRENT_TIMESTAMP)
      ON CONFLICT (setting_key) 
      DO UPDATE SET 
        setting_value = $2,
        updated_at = CURRENT_TIMESTAMP
      `,
      [key, value]
    );
  },

  async getAllSettings(): Promise<Record<string, string | null>> {
    const result = await pool.query('SELECT setting_key, setting_value FROM app_settings');
    return result.rows.reduce(
      (acc, row) => ({
        ...acc,
        [row.setting_key]: row.setting_value,
      }),
      {}
    );
  },
};
