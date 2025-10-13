import type { OmitModifier } from '@/shared/types';
import { relations } from 'drizzle-orm';
import { boolean, integer, json, jsonb, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { gameItemTable } from './game-item-schema';

export const resourceTypeEnum = pgEnum('resource_type_enum', ['IRON', 'COPPER', 'SILVER', 'GOLD', 'MITHRIL', 'ADAMANTINE']);
export const rarityEnum = pgEnum('rarity_enum', ['COMMON', 'MAGIC', 'EPIC', 'RARE', 'LEGENDARY']);

export const resourceTable = pgTable('resource', {
  id: uuid('id').primaryKey().defaultRandom(),
  type: resourceTypeEnum().notNull(),
  rarity: rarityEnum().notNull(),
  modifier: jsonb().$type<OmitModifier[]>(),
  gameItemId: uuid()
    .references(() => gameItemTable.id)
    .notNull(),
  createdAt: timestamp('created_at', {
    mode: 'string',
  })
    .defaultNow()
    .notNull(),
});

export const resourceTableRelations = relations(resourceTable, ({ one }) => ({
  gameItem: one(gameItemTable, {
    fields: [resourceTable.gameItemId],
    references: [gameItemTable.id],
  }),
}));
