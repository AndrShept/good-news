import { relations } from 'drizzle-orm';
import { pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { gameItemTable } from './game-item-schema';
import { heroTable } from './hero-schema';

export const slotEnum = pgEnum('equipment_slot_enum', [
  'RIGHT_HAND',
  'LEFT_HAND',
  'HELMET',
  'CHESTPLATE',
  'LEGS',
  'BOOTS',
  'AMULET',
  'RING_LEFT',
  'RING_RIGHT',
  'BELT',
]);

export const equipmentTable = pgTable('equipment', {
  id: uuid().primaryKey().notNull(),

  slot: slotEnum().notNull(),

  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'string',
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', {
    mode: 'string',
  }),

  heroId: uuid()
    .notNull()
    .references(() => heroTable.id, {
      onDelete: 'cascade',
    }),
  gameItemId: uuid().notNull(),
});

export const equipmentRelations = relations(equipmentTable, ({ one }) => ({
  hero: one(heroTable, {
    fields: [equipmentTable.heroId],
    references: [heroTable.id],
  }),
  gameItem: one(gameItemTable, {
    fields: [equipmentTable.gameItemId],
    references: [gameItemTable.id],
  }),
}));
