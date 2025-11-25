import type { OmitModifier } from '@/shared/types';
import { relations } from 'drizzle-orm';
import { boolean, integer, json, jsonb, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { gameItemTable } from './game-item-schema';
import { modifierTable } from './modifier-schema';

const ores = ['IRON', 'COPPER', 'SILVER', 'GOLD', 'MITHRIL', 'ADAMANTINE'] as const;
const leathers = ['REGULAR-LEATHER'] as const;

export const resourceTypeEnum = pgEnum('resource_type_enum', [...ores, ...leathers]);
export const resourceCategoryEnum = pgEnum('resource_category_enum', ['ORE', 'WOOD', 'HERB', 'LEATHER']);
export const rarityEnum = pgEnum('rarity_enum', ['COMMON', 'MAGIC', 'EPIC', 'RARE', 'LEGENDARY']);

export const resourceTable = pgTable('resource', {
  id: uuid('id').primaryKey().defaultRandom(),
  type: resourceTypeEnum().notNull(),
  category: resourceCategoryEnum().notNull(),
  rarity: rarityEnum().notNull(),
  description: text(),
  gameItemId: uuid()
    .references(() => gameItemTable.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  createdAt: timestamp('created_at', {
    mode: 'string',
  })
    .defaultNow()
    .notNull(),
});

export const resourceTableRelations = relations(resourceTable, ({ one, many }) => ({
  gameItem: one(gameItemTable, {
    fields: [resourceTable.gameItemId],
    references: [gameItemTable.id],
  }),

  modifier: one(modifierTable),
}));
