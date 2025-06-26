import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

let pgPool: Pool;

export async function initPostgres(): Promise<void> {
  try {
    pgPool = new Pool({
      host: process.env.PGHOST!,
      user: process.env.PGUSER!,
      password: process.env.PGPASSWORD!,
      database: process.env.PGDATABASE!,
      port: Number(process.env.PGPORT!),
      ssl: {
        rejectUnauthorized: false, 
      },
    });

    const client = await pgPool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('PostgreSQL connected at:', result.rows[0].now);
    client.release();
  } catch (error) {
    console.error('Failed to create PostgreSQL pool:', error);
  }
}

export { pgPool };
