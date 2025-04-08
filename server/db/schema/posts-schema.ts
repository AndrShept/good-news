import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

import { userTable } from './auth-schema';
import { commentTable } from './comments-schema';
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
    mode: 'string',
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', {
    mode: 'string',
  }),
});

export const postRelations = relations(postTable, ({ one, many }) => ({
  comments: many(commentTable),
  upvotes: many(postUpvotesTable),
  author: one(userTable, {
    fields: [postTable.authorId],
    references: [userTable.id],
  }),
}));
