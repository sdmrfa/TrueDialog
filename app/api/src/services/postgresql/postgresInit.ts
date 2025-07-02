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

    // Create tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS conversationMeta (
        portalId TEXT,
        accountId TEXT,
        phoneNumber TEXT,
        recordId TEXT PRIMARY KEY,
        conversationId TEXT,
        createdAt TIMESTAMPTZ DEFAULT NOW(),
        updatedAt TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS conversationMessages (
        recordId TEXT PRIMARY KEY,
        status TEXT,
        createdAt TIMESTAMPTZ DEFAULT NOW(),
        message TEXT,
        sender TEXT,
        receiver TEXT
      );
    `);

    console.log('✅ Tables created or already exist.');

      // Fetch and log existing table names
    const tables = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public';
    `);

    console.log('📋 Existing tables:');
    tables.rows.forEach((row) => console.log(`- ${row.table_name}`));
    
    client.release();
  } catch (error) {
    console.error('❌ Failed to initialize PostgreSQL:', error);
  }
}

export { pgPool };
