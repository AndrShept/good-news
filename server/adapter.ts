import { z } from 'zod';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { userTable } from './db/schema/auth';
import * as auth from './db/schema/auth';
import { and, eq, gt, isNull, lt } from 'drizzle-orm';

const EnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.string(),
});

const processEnv = EnvSchema.parse(process.env);

const queryClient = postgres(processEnv.DATABASE_URL);

const db = drizzle({
  client: queryClient,
  schema: { ...auth },
});

// const returns = await db
//   .insert(userTable)
//   .values([
//     {
//       id: 'asdsad',
//       username: 'zaminds',
//       password_hash: 'asdasd',
//       age: 22,
//     },
//     {
//       id: 'asdasdas',
//       username: 'RAKAL',
//       password_hash: 'asdasd',
//       age: 32,
//     },
//   ])
//   .returning({
//     // id: userTable.id,
//     username: userTable.username,
//   });

// const deleting = await db
//   .delete(userTable)
//   .where(gt(userTable.age, 21))

const query = await db.select().from(userTable).where(eq(userTable.age, 30));
const many = await db.query.userTable.findMany({
  where: isNull(userTable.age),
  columns: {
    password_hash: false,
  },
});
console.log(many);
