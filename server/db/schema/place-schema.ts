import type { Building } from '@/shared/types';
import { relations } from 'drizzle-orm';
import { boolean, integer, jsonb, pgEnum, pgTable, primaryKey, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { locationTable } from './location-schema';
import { mapTable } from './map-schema';

export const placeTypeEnum = pgEnum('place_type_enum', ['TOWN', 'DUNGEON', 'MINE']);
export const buildingTypeEnum = pgEnum('building_type_enum', ['MAGIC-SHOP', 'TEMPLE', 'BLACKSMITH', 'FORGE','BANK']);

export const placeTable = pgTable('place', {
  id: uuid().primaryKey().defaultRandom(),
  type: placeTypeEnum().notNull(),
  name: text().notNull(),
  image: text().notNull(),
  x: integer().notNull(),
  y: integer().notNull(),
  mapId: uuid()
    .references(() => mapTable.id, { onDelete: 'cascade' })
    .notNull(),
  buildings: jsonb('buildings').$type<Building[]>(),

  createdAt: timestamp({
    mode: 'string',
  }).defaultNow(),
});

export const placeTableRelations = relations(placeTable, ({ many, one }) => ({
  heroesLocation: many(locationTable),
  map: one(mapTable, {
    fields: [placeTable.mapId],
    references: [mapTable.id],
  }),
}));
