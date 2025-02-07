import { Pool } from 'pg';

let pool: Pool | null = null;

// Skip database connection during build
if (process.env.SKIP_DB_CHECK !== '1') {
  pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432'),
  });
}

export default pool;
