const { Pool } = require('pg');

async function initializeData() {
  const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'db',
    database: process.env.DB_DATABASE || 'tgeld',
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432'),
  });

  try {
    console.log('Verifying database schema...');

    // First, verify that required tables exist
    const requiredTables = [
      'app_settings',
      'users',
      'tasks',
      'completed_tasks',
      'piggybank_accounts',
    ];
    const schemaValidation = await pool.query(
      `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = ANY($1)
    `,
      [requiredTables]
    );

    const existingTables = schemaValidation.rows.map((row) => row.table_name);
    const missingTables = requiredTables.filter((table) => !existingTables.includes(table));

    if (missingTables.length > 0) {
      console.error('Schema validation failed. Missing required tables:', missingTables);
      console.error('This usually means database migrations have not run successfully.');
      console.error('Expected tables:', requiredTables);
      console.error('Found tables:', existingTables);
      return false;
    }

    console.log('Schema validation passed. All required tables exist:', existingTables);

    // Check if settings already exist
    const settingsCheck = await pool.query('SELECT COUNT(*) FROM app_settings');

    if (parseInt(settingsCheck.rows[0].count) === 0) {
      console.log('Initializing default settings...');

      // Insert default settings
      await pool.query(`
        INSERT INTO app_settings (setting_key, setting_value) VALUES
        ('enforce_roles', 'true'),
        ('currency', 'EUR'),
        ('language', 'de'),
        ('theme', 'light'),
        ('notifications_enabled', 'true')
      `);

      console.log('Default settings initialized successfully');
    } else {
      console.log('Settings already exist, skipping initialization');
    }

    // Verify the data was inserted correctly
    const finalCheck = await pool.query(
      'SELECT setting_key, setting_value FROM app_settings ORDER BY setting_key'
    );
    console.log('Current app settings:');
    finalCheck.rows.forEach((row) => {
      console.log(`  ${row.setting_key}: ${row.setting_value}`);
    });

    return true;
  } catch (error) {
    console.error('Error initializing data:', error);

    // Provide more detailed error information
    if (error.code) {
      console.error('Error code:', error.code);
    }
    if (error.detail) {
      console.error('Error detail:', error.detail);
    }
    if (error.message) {
      console.error('Error message:', error.message);
    }

    // Check if this is a connection issue
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      console.error('Database connection failed. Please check database connectivity.');
    }

    return false;
  } finally {
    await pool.end();
  }
}

// Run the initialization
initializeData()
  .then((success) => process.exit(success ? 0 : 1))
  .catch((error) => {
    console.error('Initialization script failed:', error);
    process.exit(1);
  });
