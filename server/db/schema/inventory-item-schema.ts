import { relations } from 'drizzle-orm';
import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { gameItemTable } from './game-item-schema';
import { heroTable } from './hero-schema';

export const inventoryItemTable = pgTable('inventory_item', {
  id: uuid().primaryKey().notNull(),

  quantity: integer().notNull().default(1),

  gameItemId: uuid()
    .notNull()
    .references(() => gameItemTable.id),
  inventoryHeroId: uuid()
    .notNull()
    .references(() => heroTable.id, {
      onDelete: 'cascade',
    }),
  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'string',
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', {
    mode: 'string',
  }),
});

export const inventoryItemRelations = relations(inventoryItemTable, ({  one }) => ({
  gameItem: one(gameItemTable, {
    fields: [inventoryItemTable.gameItemId],
    references: [gameItemTable.id],
  }),
  hero: one(heroTable, {
    fields: [inventoryItemTable.inventoryHeroId],
    references: [heroTable.id],
  }),
}));
