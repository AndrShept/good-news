import { relations } from 'drizzle-orm';
import { boolean, integer, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { locationTable } from './location-schema';
import { placeTable } from './place-schema';

export const pvpModeTypeEnum = pgEnum('pvp_type_enum', ['PVE', 'PVP']);
export const tileTypeEnum = pgEnum('tile_type_enum', ['OBJECT', 'WATER', 'HERO', 'TOWN', 'GROUND']);

export const mapTable = pgTable('map', {
  id: uuid().primaryKey().notNull(),
  width: integer().notNull(),
  height: integer().notNull(),
  tileHeight: integer().notNull(),
  tileWidth: integer().notNull(),
  image: text().notNull(),
  name: text().notNull(),
  pvpMode: pvpModeTypeEnum()
    .$defaultFn(() => 'PVE')
    .notNull(),
  createdAt: timestamp({
    mode: 'string',
  })
    .defaultNow()
    .notNull(),
});

export const mapTableRelations = relations(mapTable, ({ many }) => ({
  heroesLocation: many(locationTable),
  places: many(placeTable),
}));
