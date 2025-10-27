import type { ResourceType } from '@/shared/types';
import { relations } from 'drizzle-orm';
import { integer, jsonb, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { gameItemTable } from './game-item-schema';

export const craftTable = pgTable('craft-item', {
  id: uuid().primaryKey().defaultRandom().notNull(),

  gameItemId: uuid()
    .references(() => gameItemTable.id, { onDelete: 'cascade' })
    .notNull(),

  craftTime: integer().default(0).notNull(),
  requiredLevel: integer().default(1).notNull(),
  craftResources: jsonb().$type<{ type: ResourceType; quantity: number }[]>(),
});

export const craftTableRelations = relations(craftTable, ({ one }) => ({
  gameItem: one(gameItemTable, {
    fields: [craftTable.gameItemId],
    references: [gameItemTable.id],
  }),
}));
