import { relations } from 'drizzle-orm';
import { boolean, integer, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { buildingNameTypeEnum } from './building-schema';
import { heroTable } from './hero-schema';
import { mapTable } from './map-schema';
import { townTable } from './town-schema';

export const locationTable = pgTable('location', {
  id: uuid().primaryKey().defaultRandom(),

  townId: uuid().references(() => townTable.id, {
    onDelete: 'set null',
  }),
  mapId: uuid().references(() => mapTable.id, {
    onDelete: 'cascade',
  }),
  heroId: uuid()
    .references(() => heroTable.id, {
      onDelete: 'cascade',
    })
    .notNull(),

  x: integer().default(0).notNull(),
  y: integer().default(0).notNull(),
  currentBuilding: buildingNameTypeEnum(),
  createdAt: timestamp({
    mode: 'string',
  }).defaultNow(),
});

export const locationTableRelations = relations(locationTable, ({ one }) => ({
  hero: one(heroTable, {
    fields: [locationTable.heroId],
    references: [heroTable.id],
  }),

  town: one(townTable, {
    fields: [locationTable.townId],
    references: [townTable.id],
  }),
  map: one(mapTable, {
    fields: [locationTable.mapId],
    references: [mapTable.id],
  }),
}));
