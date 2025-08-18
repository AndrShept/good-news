import { relations } from 'drizzle-orm';
import { boolean, integer, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { heroTable } from './hero-schema';
import { mapTable } from './map-schema';

export const tileTypeEnum = pgEnum('tile_type_enum', ['OBJECT', 'DECOR', 'GROUND']);

export const tileTable = pgTable('tile', {
  id: uuid().primaryKey().defaultRandom(),

  type: tileTypeEnum().notNull(),
  x: integer().notNull(),
  y: integer().notNull(),
  z: integer().notNull(),
  image: integer().notNull(),
  mapId: uuid()
    .references(() => mapTable.id, {
      onDelete: 'cascade',
    })
    .notNull(),


  createdAt: timestamp({
    mode: 'string',
  })
    .defaultNow()
    .notNull(),
});

export const tileTableRelations = relations(tileTable, ({ one, many }) => ({
  heroes: many(heroTable),
  map: one(mapTable, {
    fields: [tileTable.mapId],
    references: [mapTable.id],
  }),

}));
