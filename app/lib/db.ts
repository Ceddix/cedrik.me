import { neon } from '@neondatabase/serverless';

export function getDb() {
  const dbUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL || '';
  if (!dbUrl) {
    throw new Error('Database connection URL is missing in environment variables.');
  }
  return neon(dbUrl);
}

export interface ShortLink {
  id: number;
  alias: string;
  target: string;
  visit_count: number;
  created_at?: string;
}

export async function initLinksTable() {
  try {
    const sql = getDb();
    await sql`
      CREATE TABLE IF NOT EXISTS links (
        id SERIAL PRIMARY KEY,
        alias VARCHAR(255) UNIQUE NOT NULL,
        target TEXT NOT NULL,
        visit_count INT DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `;
    // Ensure created_at exists even on pre-existing tables
    await sql`
      ALTER TABLE links ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;
    `;
  } catch (error) {
    console.error('Failed to initialize links table schema:', error);
  }
}
