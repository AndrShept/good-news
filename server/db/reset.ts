import { sql } from 'drizzle-orm';
import { db } from './db';

await db.execute(sql`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`);