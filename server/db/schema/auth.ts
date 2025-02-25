import { relations } from 'drizzle-orm';
import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const userTable = pgTable('user', {
  id: text().primaryKey(),
  username: text().notNull().unique(),
  password_hash: text('password_hash').notNull(),
  age: integer('age'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt'),
});

export const sessionTable = pgTable('session', {
  id: text().primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
});

const userRelations = relations(userTable, ({ many }) => ({
  sessions: many(sessionTable),
}));

const sessionRelations = relations(sessionTable, ({ one }) => ({
  user: one(userTable, {
    fields: [sessionTable.userId],
    references: [userTable.id],
  }),
}));
