import type { CraftItemRequiredResources, ResourceType } from '@/shared/types';
import { relations } from 'drizzle-orm';
import { integer, jsonb, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { gameItemTable } from './game-item-schema';

export const craftItemTable = pgTable('craft-item', {
  id: uuid().primaryKey().defaultRandom().notNull(),

  gameItemId: uuid()
    .references(() => gameItemTable.id, { onDelete: 'cascade' })
    .notNull(),

  craftTime: integer().default(0).notNull(),
  requiredLevel: integer().default(1).notNull(),
  requiredResources: jsonb().$type<CraftItemRequiredResources[]>().notNull(),
});

export const craftTableRelations = relations(craftItemTable, ({ one }) => ({
  gameItem: one(gameItemTable, {
    fields: [craftItemTable.gameItemId],
    references: [gameItemTable.id],
  }),
}));
