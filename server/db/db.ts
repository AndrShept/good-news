import { z } from 'zod';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { sessionTable, userTable } from './schema/auth';

const EnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.string(),
});

const processEnv = EnvSchema.parse(process.env);

const queryClient = postgres(processEnv.DATABASE_URL);

export const db = drizzle({
  client: queryClient,
  schema: { auth: userTable, session: sessionTable },
});

export const adapter = new DrizzlePostgreSQLAdapter(
  db,
  sessionTable,
  userTable
);
