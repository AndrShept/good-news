import { relations } from 'drizzle-orm';
import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { postTable } from './posts';
import { commentTable } from './comments';

export const userTable = pgTable('user', {
  id: text().primaryKey(),
  username: text().notNull().unique(),
  password_hash: text('password_hash').notNull(),
  age: integer('age'),
  createdAt: timestamp('created_at', {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at'),
});
const userRelations = relations(userTable, ({ many }) => ({
  sessions: many(sessionTable),
  posts: many(postTable),
  comments: many(commentTable),
}));

export const sessionTable = pgTable('session', {
  id: text().primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
});

const sessionRelations = relations(sessionTable, ({ one }) => ({
  user: one(userTable, {
    fields: [sessionTable.userId],
    references: [userTable.id],
  }),
}));
