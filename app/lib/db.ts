import { Pool } from 'pg';

const pool = new Pool({
  user: 'tgeld_admin',
  host: 'localhost',
  database: 'tgeld',
  password: "*R2?c6M$uvEg'eD",
  port: 5432,
});

export default pool;
