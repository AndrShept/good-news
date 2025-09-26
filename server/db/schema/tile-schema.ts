import { relations } from 'drizzle-orm';
import { boolean, integer, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { heroTable } from './hero-schema';
import { locationTable } from './location-schema';
import { mapTable } from './map-schema';
import { townTable } from './town-schema';

export const tileTypeEnum = pgEnum('tile_type_enum', ['OBJECT', 'WATER', 'HERO', 'TOWN', 'GROUND']);

export const tileTable = pgTable('tile', {
  id: uuid().primaryKey().defaultRandom(),

  type: tileTypeEnum().notNull(),


  createdAt: timestamp({
    mode: 'string',
  })
    .defaultNow()
    .notNull(),
});

export const tileTableRelations = relations(tileTable, ({ one }) => ({

}));
