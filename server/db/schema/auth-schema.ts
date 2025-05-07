import { relations } from 'drizzle-orm';
import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

import { commentTable } from './comments-schema';
import { postTable } from './posts-schema';
import { commentUpvotesTable, postUpvotesTable } from './upvotes-schema';
import { sessionTable } from './session-schema';
import { heroTable } from './hero-schema';

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
  heroes: many(heroTable),
}));

