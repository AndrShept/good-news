import { relations } from 'drizzle-orm';
import { boolean, integer, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { buildingNameTypeEnum } from './building-schema';
import { heroTable } from './hero-schema';
import { mapTable } from './map-schema';
import { townTable } from './town-schema';

export const locationTypeEnum = pgEnum('location_type_enum', ['TOWN', 'MAP', 'DUNGEON']);

export const locationTable = pgTable('location', {
  id: uuid().primaryKey().defaultRandom(),
  type: locationTypeEnum().notNull(),
  mapId: uuid().references(() => mapTable.id, {
    onDelete: 'set null',
  }),
  townId: uuid().references(() => townTable.id, {
    onDelete: 'set null',
  }),
  currentBuilding: buildingNameTypeEnum(),

  createdAt: timestamp({
    mode: 'string',
  }).defaultNow(),
});

export const locationTableRelations = relations(locationTable, ({ one, many }) => ({
  heroes: many(heroTable),
  map: one(mapTable, {
    fields: [locationTable.mapId],
    references: [mapTable.id],
  }),
  town: one(townTable, {
    fields: [locationTable.townId],
    references: [townTable.id],
  }),
}));
