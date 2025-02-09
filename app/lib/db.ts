import { Pool } from 'pg';

let pool;

// During build time or when environment variables are not available,
// return a dummy pool that will be replaced at runtime
if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build') {
  console.log('Build time - using dummy database connection');
  pool = {
    query: async () => ({ rows: [] }),
    connect: async () => ({
      query: async () => ({ rows: [] }),
      release: () => {},
    }),
  };
} else {
  pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
  });
}

export default pool;
