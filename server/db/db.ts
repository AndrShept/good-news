import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
// import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { processEnv } from '../lib/utils';
import { userTable } from './schema/auth-schema';
import * as schema from './schema/index';
import { sessionTable } from './schema/session-schema';
import { Pool } from '@neondatabase/serverless';
import { drizzle, type NeonQueryResultHKT } from 'drizzle-orm/neon-serverless';
import type { PgTransaction } from 'drizzle-orm/pg-core';
import type { ExtractTablesWithRelations } from 'drizzle-orm';


// const queryClient = postgres(processEnv.DATABASE_URL);
// export const db = drizzle({
//   client: queryClient,
//   schema,
// });
export type TTransaction = PgTransaction<NeonQueryResultHKT, typeof schema, ExtractTablesWithRelations<typeof schema>>
export type TDataBase = typeof db

const pool = new Pool({ connectionString: processEnv.DATABASE_URL });
export const db = drizzle({ client: pool, schema })

export const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);
