import type { OmitModifier } from '@/shared/types';
import { relations } from 'drizzle-orm';
import { integer, jsonb, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { buffTemplateTable } from './buff-template-schema';
import { heroTable } from './hero-schema';

export const buffInstanceTable = pgTable('buff_instance', {
  id: uuid().primaryKey().defaultRandom().notNull(),

  ownerHeroId: uuid()
    .references(() => heroTable.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  buffTemplateId: uuid()
    .references(() => buffTemplateTable.id, {
      onDelete: 'cascade',
    })
    .notNull(),

  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'string',
  })
    .notNull()
    .defaultNow(),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'string',
  }).notNull(),
});

export const buffInstanceRelations = relations(buffInstanceTable, ({ one }) => ({
  hero: one(heroTable, {
    fields: [buffInstanceTable.ownerHeroId],
    references: [heroTable.id],
  }),
  buffTemplate: one(buffTemplateTable, {
    fields: [buffInstanceTable.buffTemplateId],
    references: [buffTemplateTable.id],
  }),
}));
