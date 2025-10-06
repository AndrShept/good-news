import { relations } from 'drizzle-orm';
import { integer, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { heroTable } from './hero-schema';
import { modifierTable } from './modifier-schema';

export const buffType = pgEnum('buff_type_enum', ['SPELL', 'POTION']);

export const buffTable = pgTable('buff', {
  id: uuid().primaryKey().notNull(),

  name: text().notNull(),
  image: text().notNull(),
  duration: integer().default(0).notNull(),
  type: buffType().notNull(),
  heroId: uuid()
    .notNull()
    .references(() => heroTable.id, {
      onDelete: 'cascade',
    }),
  completedAt: timestamp(' completed_at', {
    withTimezone: true,
    mode: 'string',
  }).notNull(),
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

export const buffRelations = relations(buffTable, ({ one }) => ({
  modifier: one(modifierTable),
    hero: one(heroTable, {
    fields: [buffTable.heroId],
    references: [heroTable.id],
  }),
}));
