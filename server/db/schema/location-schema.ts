import { relations } from 'drizzle-orm';
import { boolean, integer, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { heroTable } from './hero-schema';
import { mapTable } from './map-schema';
import { placeTable } from './place-schema';

export const locationTable = pgTable('location', {
  id: uuid().primaryKey().defaultRandom(),

  placeId: uuid().references(() => placeTable.id, {
    onDelete: 'set null',
  }),
  mapId: uuid().references(() => mapTable.id, {
    onDelete: 'set null',
  }),
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

  place: one(placeTable, {
    fields: [locationTable.placeId],
    references: [placeTable.id],
  }),
  map: one(mapTable, {
    fields: [locationTable.mapId],
    references: [mapTable.id],
  }),
}));
