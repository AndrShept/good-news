import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { processEnv } from '../lib/utils';
import { userTable } from './schema/auth-schema';
import * as schema from './schema/index';
import { sessionTable } from './schema/session-schema';

const queryClient = postgres(processEnv.DATABASE_URL);
export const db = drizzle({
  client: queryClient,
  schema,
});

export const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);
