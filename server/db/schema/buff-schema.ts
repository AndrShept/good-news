import type { OmitModifier } from '@/shared/types';
import { relations } from 'drizzle-orm';
import { integer, jsonb, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { heroTable } from './hero-schema';

export const buffTypeEnum = pgEnum('buff_type_enum', ['POSITIVE', 'NEGATIVE']);

export const buffTable = pgTable('buff', {
  id: uuid().primaryKey().defaultRandom().notNull(),
  name: text().notNull(),
  image: text().notNull(),
  duration: integer().notNull(),
  type: buffTypeEnum().notNull(),
  modifier: jsonb('modifier').$type<Partial<OmitModifier>>().notNull(),
  heroId: uuid()
    .references(() => heroTable.id, {
      onDelete: 'cascade',
    })
    .notNull(),

  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'string',
  })
    .notNull()
    .defaultNow(),
  completedAt: timestamp('completed_at', {
    withTimezone: true,
    mode: 'string',
  }).notNull(),
});

export const buffRelations = relations(buffTable, ({ one }) => ({
  hero: one(heroTable, {
    fields: [buffTable.heroId],
    references: [heroTable.id],
  }),
}));
