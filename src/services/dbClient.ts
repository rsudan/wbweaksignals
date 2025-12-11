import { neon } from '@neondatabase/serverless';

const databaseUrl = import.meta.env.VITE_DATABASE_URL;

if (!databaseUrl) {
  throw new Error('Missing VITE_DATABASE_URL environment variable');
}

export const sql = neon(databaseUrl);
