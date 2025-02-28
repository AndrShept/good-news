import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { userTable } from './auth-schema';
import { postTable } from './posts-schema';
import { relations } from 'drizzle-orm';
import { commentUpvotesTable } from './upvotes-schema';

export const commentTable = pgTable('comment', {
  id: serial().primaryKey(),
  content: text().notNull(),
  depth: integer().default(0).notNull(),
  points: integer().default(0).notNull(),
  commentCount: integer('comment_count').notNull().default(0),
  parentCommentId: text('parent_comment_id'),
  authorId: text('author_id')
    .notNull()
    .references(() => userTable.id),
  postId: integer('post_id')
    .notNull()
    .references(() => postTable.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  createdAt: timestamp('created_at', {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at'),
});

export const commentRelation = relations(commentTable, ({ one, many }) => ({
  author: one(userTable, {
    fields: [commentTable.authorId],
    references: [userTable.id],
  }),
  post: one(postTable, {
    fields: [commentTable.postId],
    references: [postTable.id],
  }),
  upvotes: many(commentUpvotesTable),
}));
