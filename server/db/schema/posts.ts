import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { userTable } from './auth';
import { commentTable } from './comments';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

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

const postRelations = relations(postTable, ({ one, many }) => ({
  author: one(userTable, {
    fields: [postTable.authorId],
    references: [userTable.id],
  }),
  comments: many(commentTable),
}));

export const insertPostSchema = createInsertSchema(postTable, {
  title: z.string().min(3),
  url: z
    .string()
    .trim()
    .url({ message: 'URL must be a valid URL' })
    .optional()
    .or(z.literal('')),
  content: z.string().optional(),

})
