import { relations } from 'drizzle-orm';
import { integer, jsonb, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { craftItemTable } from './craft-item-schema';
import { heroTable } from './hero-schema';
import { resourceTypeEnum } from './resource-schema';

export const queueCraftStatusEnum = pgEnum('queue_craft_status_enum', ['PENDING', 'PROGRESS', 'COMPLETE', 'FAILED']);

export const queueCraftItemTable = pgTable('queue-craft-item', {
  id: uuid().primaryKey().defaultRandom().notNull(),
  jobId: text().notNull(),
  status: queueCraftStatusEnum().notNull(),
  baseMaterial: resourceTypeEnum().notNull(),
  craftItemId: uuid()
    .references(() => craftItemTable.id, { onDelete: 'cascade' })
    .notNull(),
  heroId: uuid()
    .references(() => heroTable.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at', {
    mode: 'string',
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
  completedAt: timestamp('completed_at', {
    mode: 'string',
    withTimezone: true,
  }).notNull(),
});

export const queueCraftItemTableRelations = relations(queueCraftItemTable, ({ one }) => ({
  craftItem: one(craftItemTable, {
    fields: [queueCraftItemTable.craftItemId],
    references: [craftItemTable.id],
  }),
  hero: one(heroTable, {
    fields: [queueCraftItemTable.heroId],
    references: [heroTable.id],
  }),
}));
