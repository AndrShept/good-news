import { relations } from 'drizzle-orm';
import { boolean, integer, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { buildingTypeEnum } from './location-schema';
import { tileTable } from './tile-schema';

export const worldObjectNameEnum = pgEnum('worldObject_name_enum', ['SOLMERE']);
export const worldObjectTypeEnum = pgEnum('worldObject_type_enum', ['TOWN', 'DUNGEON']);
export const worldObjectTable = pgTable('world_object', {
  id: uuid().primaryKey().defaultRandom(),
  type: worldObjectTypeEnum().notNull(),
  name: worldObjectNameEnum().notNull(),
  image: text().notNull(),
  createdAt: timestamp({
    mode: 'string',
  })
    .defaultNow()
    .notNull(),
});

export const worldObjectTableRelations = relations(worldObjectTable, ({ many }) => ({
  tiles: many(tileTable),
}));
