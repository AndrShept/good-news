import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql', // 'mysql' | 'sqlite' | 'turso'
  schema: './server/db/schema/index.ts',
  out: 'drizzle',
  dbCredentials: {
    url: process.env['DATABASE_URL']!,
  },
});
