import type { CraftItemRequiredResources, ResourceType } from '@/shared/types';
import { relations } from 'drizzle-orm';
import { integer, jsonb, pgEnum, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { gameItemTable } from './game-item-schema';
import { resourceCategoryEnum } from './resource-schema';

export const buildingTypeEnum = pgEnum('building_type_enum', ['MAGIC-SHOP', 'TEMPLE', 'BLACKSMITH', 'FORGE', 'BANK'] );


export const craftItemTable = pgTable('craft-item', {
  id: uuid().primaryKey().defaultRandom().notNull(),

  gameItemId: uuid()
    .references(() => gameItemTable.id, { onDelete: 'cascade' })
    .notNull(),

  requiredCraftResourceCategory: resourceCategoryEnum().notNull(),
  requiredBuildingType: buildingTypeEnum().notNull(),
});

export const craftTableRelations = relations(craftItemTable, ({ one }) => ({
  gameItem: one(gameItemTable, {
    fields: [craftItemTable.gameItemId],
    references: [gameItemTable.id],
  }),
}));
