import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

import { heroTable } from './hero-schema';

export const groupTable = pgTable('group', {
  id: text().primaryKey().notNull(),
  leaderId: text().notNull(),
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

export const groupRelations = relations(groupTable, ({ many }) => ({
  heroes: many(heroTable),
}));
