import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { z } from 'zod';

import { sessionTable, userTable } from './schema/auth-schema';
import * as auth from './schema/auth-schema';
import * as comments from './schema/comments-schema';
import * as posts from './schema/posts-schema';
import * as upvotes from './schema/upvotes-schema';

const EnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.string(),
});

const processEnv = EnvSchema.parse(process.env);

const queryClient = postgres(processEnv.DATABASE_URL);
export const db = drizzle({
  client: queryClient,
  schema: {
    ...posts,
    ...auth,
    ...comments,
    ...upvotes,
  },
});

export const adapter = new DrizzlePostgreSQLAdapter(
  db,
  sessionTable,
  userTable,
);
