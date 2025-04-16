import { relations } from 'drizzle-orm';
import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

import { commentTable } from './comments-schema';
import { postTable } from './posts-schema';
import { commentUpvotesTable, postUpvotesTable } from './upvotes-schema';

export const userTable = pgTable('user', {
  id: text().primaryKey(),
  username: text().notNull().unique(),
  email: text().notNull().unique(),
  password_hash: text('password_hash').notNull(),
  age: integer('age'),
  image: text().notNull(),
  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'string',
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', {
    mode: 'string',
  }),
});
export const userRelations = relations(userTable, ({ many }) => ({
  sessions: many(sessionTable),
  posts: many(postTable),
  comments: many(commentTable),
  postUpvotes: many(postUpvotesTable),
  commentUpvotes: many(commentUpvotesTable),
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
  }).notNull(),
});

export const sessionRelations = relations(sessionTable, ({ one }) => ({
  user: one(userTable, {
    fields: [sessionTable.userId],
    references: [userTable.id],
  }),
}));
