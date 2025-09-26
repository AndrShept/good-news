import { relations } from 'drizzle-orm';
import { boolean, integer, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { locationTable } from './location-schema';
import { townTable } from './town-schema';

export const mapNameTypeEnum = pgEnum('map_name_type_enum', ['SOLMERE']);
export const pvpModeTypeEnum = pgEnum('pvp_type_enum', ['PVE', 'PVP']);

export const mapTable = pgTable('map', {
  id: uuid().primaryKey().defaultRandom(),
  width: integer().notNull(),
  height: integer().notNull(),
  tileHeight: integer().notNull(),
  tileWidth: integer().notNull(),
  image: text().notNull(),
  name: mapNameTypeEnum().notNull(),
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
  towns: many(townTable),
}));
