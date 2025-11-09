import { relations } from 'drizzle-orm';
import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { gameItemTable } from './game-item-schema';
import { heroTable } from './hero-schema';
import { itemContainerTable } from './item-container-schema';

export const containerSlotTable = pgTable('container_slot', {
  id: uuid().primaryKey().defaultRandom().notNull(),

  quantity: integer().notNull().default(1),

  gameItemId: uuid()
    .notNull()
    .references(() => gameItemTable.id, {
      onDelete: 'cascade',
    }),
  itemContainerId: uuid()
    .notNull()
    .references(() => itemContainerTable.id, {
      onDelete: 'cascade',
    }),
  createdAt: timestamp('created_at', {
    mode: 'string',
  })
    .notNull()
    .defaultNow(),
});

export const containerItemTableRelations = relations(containerSlotTable, ({ one }) => ({
  gameItem: one(gameItemTable, {
    fields: [containerSlotTable.gameItemId],
    references: [gameItemTable.id],
  }),
  itemContainer: one(itemContainerTable, {
    fields: [containerSlotTable.itemContainerId],
    references: [itemContainerTable.id],
  }),
}));
