import { relations } from 'drizzle-orm';
import { boolean, integer, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { buildingNameTypeEnum } from './building-schema';
import { heroTable } from './hero-schema';
import { townNameTypeEnum } from './town-schema';

export const locationTypeEnum = pgEnum('location_type_enum', ['TOWN', 'MAP']);

export const locationTable = pgTable('location', {
  id: uuid().primaryKey().defaultRandom(),
  type: locationTypeEnum()
    .$default(() => 'TOWN')
    .notNull(),
  townName: townNameTypeEnum(),
  buildingName: buildingNameTypeEnum(),
  x: integer(),
  y: integer(),
  createdAt: timestamp({
    mode: 'string',
  }).defaultNow(),
});

export const locationTableRelations = relations(locationTable, ({ many }) => ({
  heroes: many(heroTable),
}));
