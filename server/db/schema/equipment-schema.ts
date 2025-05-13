import { relations } from 'drizzle-orm';
import { pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

import { heroTable } from './hero-schema';

export const slotEnum = pgEnum('equipment_slot', [
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
  id: text().primaryKey().notNull(),

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

  heroId: text()
    .notNull()
    .references(() => heroTable.id, {
      onDelete: 'cascade',
    }),
});

export const equipmentRelations = relations(equipmentTable, ({ one }) => ({
  user: one(heroTable, {
    fields: [equipmentTable.heroId],
    references: [heroTable.id],
  }),
}));
