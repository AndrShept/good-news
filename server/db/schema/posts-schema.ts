import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { userTable } from './auth-schema';
import { commentTable } from './comments-schema';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { postUpvotesTable } from './upvotes-schema';

export const postTable = pgTable('post', {
  id: serial().primaryKey(),
  content: text(),
  title: text().notNull(),
  url: text(),
  points: integer().notNull().default(0),
  commentCount: integer('comment_count').notNull().default(0),
  authorId: text('author_id')
    .notNull()
    .references(() => userTable.id),
  createdAt: timestamp('created_at', {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at'),
});

export const postRelations = relations(postTable, ({ one, many }) => ({
  author: one(userTable, {
    fields: [postTable.authorId],
    references: [userTable.id],
  }),
  comments: many(commentTable),
  upvotes: many(postUpvotesTable),
}));

