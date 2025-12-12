import type { OmitModifier } from '@/shared/types';
import { relations } from 'drizzle-orm';
import { boolean, integer, json, jsonb, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { gameItemTable } from './game-item-schema';
import { modifierTable } from './modifier-schema';

const oreValues = ['IRON-ORE', 'COPPER-ORE', 'SILVER-ORE', 'GOLD-ORE', 'MITHRIL-ORE', 'ADAMANTINE-ORE'] as const;
const leatherValues = ['REGULAR-LEATHER'] as const;
const ingotValues = ['IRON-INGOT', 'COPPER-INGOT', 'SILVER-INGOT', 'GOLD-INGOT', 'MITHRIL-INGOT', 'ADAMANTINE-INGOT'] as const;

export const ingotTypeEnum = pgEnum('ingot_type_enum', [...ingotValues]);
export const oreTypeEnum = pgEnum('ore_type_enum', [...oreValues]);
export const leatherTypeEnum = pgEnum('leather_type_enum', [...leatherValues]);
export const resourceTypeEnum = pgEnum('resource_type_enum', [...oreValues, ...leatherValues, ...ingotValues]);
export const armorMaterialCraftTypeEnum = pgEnum('armor_material_craft_enum', [...leatherValues, ...ingotValues]);
export const resourceCategoryEnum = pgEnum('resource_category_enum', ['ORE', 'WOOD', 'HERB', 'LEATHER', 'INGOT']);
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

  // modifier: one(modifierTable),
}));
