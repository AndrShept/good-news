import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

import { userTable } from './auth-schema';
import { commentTable } from './comments-schema';
import { postTable } from './posts-schema';

export const postUpvotesTable = pgTable('post_upvotes', {
  id: serial('id').primaryKey(),
  postId: integer('post_id')
    .notNull()
    .references(() => postTable.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const postUpvoteRelations = relations(postUpvotesTable, ({ one }) => ({
  post: one(postTable, {
    fields: [postUpvotesTable.postId],
    references: [postTable.id],
    relationName: 'postUpvotes',
  }),
  user: one(userTable, {
    fields: [postUpvotesTable.userId],
    references: [userTable.id],
    relationName: 'user',
  }),
}));

export const commentUpvotesTable = pgTable('comment_upvotes', {
  id: serial('id').primaryKey(),
  commentId: integer('comment_id')
    .notNull()
    .references(() => commentTable.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const commentUpvoteRelations = relations(commentUpvotesTable, ({ one }) => ({
  comment: one(commentTable, {
    fields: [commentUpvotesTable.commentId],
    references: [commentTable.id],
    relationName: 'commentUpvotes',
  }),
  user: one(userTable, {
    fields: [commentUpvotesTable.userId],
    references: [userTable.id],
    relationName: 'user',
  }),
}));
