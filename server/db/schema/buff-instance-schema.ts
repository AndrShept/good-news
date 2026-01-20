import type { OmitModifier } from '@/shared/types';
import { relations } from 'drizzle-orm';
import { integer, jsonb, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { heroTable } from './hero-schema';

export const buffInstanceTable = pgTable('buff_instance', {
  id: uuid().primaryKey().defaultRandom().notNull(),

  ownerHeroId: uuid()
    .references(() => heroTable.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  buffTemplateId: uuid().notNull(),

  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'string',
  })
    .notNull()
    .defaultNow(),
  expiresAt: integer().notNull(),
});

export const buffInstanceRelations = relations(buffInstanceTable, ({ one }) => ({
  hero: one(heroTable, {
    fields: [buffInstanceTable.ownerHeroId],
    references: [heroTable.id],
  }),

}));
