import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';
export default defineConfig({
  dialect: 'postgresql', // 'mysql' | 'sqlite' | 'turso'
  schema: './server/db/schema/index.ts',
  out: 'drizzle',
  dbCredentials: {
    url: process.env['DATABASE_URL']!,
  },
});
