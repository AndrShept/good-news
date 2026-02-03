import { relations } from 'drizzle-orm';
import { integer, jsonb, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { heroTable } from './hero-schema';



export const queueCraftStatusEnum = pgEnum('queue_craft_status_enum', ['PENDING', 'PROGRESS']);

export const queueCraftItemTable = pgTable('queue-craft-item', {
  id: uuid().primaryKey().defaultRandom().notNull(),
  jobId: text().notNull(),
  status: queueCraftStatusEnum().notNull(),

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

  hero: one(heroTable, {
    fields: [queueCraftItemTable.heroId],
    references: [heroTable.id],
  }),
}));
