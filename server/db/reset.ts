import { sql } from 'drizzle-orm';
import { db } from './db';

await db.execute(sql`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`);

// const result = await db.execute(sql`
//   SELECT tablename 
//   FROM pg_tables 
//   WHERE schemaname = 'public'
//     AND tablename != 'user';
// `);

// const rows = Array.isArray(result) ? result : (result.rows ?? []);

// for (const row of rows) {
//   await db.execute(
//     sql`TRUNCATE TABLE ${sql.identifier([row.tablename])} RESTART IDENTITY CASCADE;`
//   );
// }