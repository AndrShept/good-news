import { relations } from 'drizzle-orm';
import { boolean, integer, pgEnum, pgTable, primaryKey, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { buildingTable } from './building-schema';
import { locationTable } from './location-schema';
import { tileTable } from './tile-schema';

export const townNameTypeEnum = pgEnum('town_name_type_enum', ['SOLMERE']);

export const townTable = pgTable('town', {
  id: uuid().primaryKey().defaultRandom(),

  name: townNameTypeEnum().notNull(),
  image: text().notNull(),
  createdAt: timestamp({
    mode: 'string',
  })
    .defaultNow()
    .notNull(),
});

export const townTableRelations = relations(townTable, ({ many }) => ({
  buildings: many(townsToBuildingsTable),
  tiles: many(tileTable),
}));

export const townsToBuildingsTable = pgTable(
  'town_to_buildings',
  {
    townId: uuid()
      .notNull()
      .references(() => townTable.id, {
        onDelete: 'set null',
      }),
    buildingsId: uuid()
      .notNull()
      .references(() => buildingTable.id, {
        onDelete: 'set null',
      }),
  },
  (t) => [primaryKey({ columns: [t.buildingsId, t.townId] })],
);

export const townsToBuildingsTableRelations = relations(townsToBuildingsTable, ({ one, many }) => ({
  town: one(townTable, {
    fields: [townsToBuildingsTable.townId],
    references: [townTable.id],
  }),
  building: one(buildingTable, {
    fields: [townsToBuildingsTable.buildingsId],
    references: [buildingTable.id],
  }),
  locations: many(locationTable),
}));
