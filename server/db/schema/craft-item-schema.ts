import type { CraftItemRequiredResources, ResourceType } from '@/shared/types';
import { relations } from 'drizzle-orm';
import { integer, jsonb, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { gameItemTable } from './game-item-schema';
import { buildingTypeEnum } from './place-schema';
import { resourceCategoryEnum } from './resource-schema';

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
