import { relations } from 'drizzle-orm';
import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { userTable } from './auth-schema';

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
