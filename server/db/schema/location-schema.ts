import { relations } from 'drizzle-orm';
import { boolean, integer, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { heroTable } from './hero-schema';

export const locationTable = pgTable('location', {
  id: uuid().primaryKey().defaultRandom(),

  placeId: uuid(),
  mapId: uuid(),
  heroId: uuid()
    .references(() => heroTable.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  x: integer().default(0).notNull(),
  y: integer().default(0).notNull(),
  targetX: integer(),
  targetY: integer(),
  createdAt: timestamp({
    mode: 'string',
  }).defaultNow(),
});

export const locationTableRelations = relations(locationTable, ({ one }) => ({
  hero: one(heroTable, {
    fields: [locationTable.heroId],
    references: [heroTable.id],
  }),
}));
